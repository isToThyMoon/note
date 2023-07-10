
高阶组件和render prop都是为了解决逻辑复用的问题，但这两种方案都不可避免的会碰到一个问题：我们的组件会被层层叠叠的provider包裹着。

这时候，就需要一个更底层的方案来解决逻辑状态复用的问题，所以Hooks应运而生。

在hooks之前有一个recompose库致力于解决同样的问题，后来作者加入了FB，孵化出了react hooks。

一个标准的业务和UI不分离的组件代码：
```
class Card extends React.PureComponent {
    state = {
        name: undefined,
        link: undefined,
        buyerNum: undefined,
        logoUrl: undefined,
    }

    componentDidMount() {
        getCardById(this.props.id).then(card => {
            const {name ,link, buyerNum, logoUrl} = card;
            this.setState({
                name,
                link,
                buyerNum,
                logoUrl,
            })
        });
    }

    render() {
        const {name ,link, buyerNum, logoUrl} = this.state;
        return (
            <div className="card">
            <div className="logo">
                <img src={logoUrl} alt={name} />
            </div>
            <div className="name">{name}</div>
            <div className="buyer-num">
                {buyerNum}人已购买
            </div>
            <div className="booklet-link">
                <a href={link}>试读</a>
            </div>
        </div>
        )
    }
}
```

看看recompose这个库如何解决：（作者加入了fb，主要参与贡献了hooks）

UI层：
```
// path: components/Card/index.jsx
const Card = ({name, logoUrl, buyerNum, link}) => {
    return (
        <div className="card">
            <div className="logo">
                <img src={logoUrl} alt={name} />
            </div>
            <div className="name">{name}</div>
            <div className="buyer-num">
                {buyerNum}人已购买
            </div>
            <div className="booklet-link">
                <a href={link}>试读</a>
            </div>
        </div>
    )
}
```

业务逻辑层：
```
// path: containers/Card/index.js
import {lifecycle, compose, withState, withProps} from 'recompose';
import Card from '../../components/Card';

// recompose提供的创建state的hoc
const withCardState = withState(
    'card', 'handleUpdateCard', {}
);

// recompose提供的再次处理props的hoc
const withCardProps = withProps(
    ({card}) => ({
        ...card,
    })
)

// recompose提供的生命周期钩子的hoc
const withLifecycle = lifecycle({
    componentDidMount() {
        getCardById().then(card => {
            this.props.handleUpdateCard(card);
        })
    }
});

// compose 从右边往左边执行嵌套HOC的逻辑 相当于lodash的flowRight,顺序很关键。
export default compose(
    withCardState,
    withCardProps,
    withLifecycle,
)(Card);
```

新的代码中Card的UI组件不再被任何业务逻辑干扰。Card的container包含了本次根据id获取卡片的业务逻辑。如果后续需要卡片列表。只需要一个CardList的container去获取数据，渲染Card的UI组件。
类似Redux的compose一样，搞个中间件把所有逻辑数据控制都在父组件，子组件做纯渲染，使用card组件时，选择使用Card纯UI Component，也可以选择使用带有逻辑的Card Containe，这是父组件决定的。

这其实还是容器组件和UI组件分离的高级形式。

recompose这个库作者加入FB后可能参与了react hooks的推出，它解决了recompose要解决的所有问题，提供一种更纯粹的实践UI=f(state)的方式。

我倾向于UI逻辑采用react式的纯函数式构建，唯一输入对应唯一输出（UI），确定的数据对应确定的UI是非常自然而然的，而把业务逻辑从原本的“业务UI不分离组件”中抽离出来，更好的方案是采用后端面向对象式的开发模式，将业务构成一个个业务模型，每次的迭代都在充实class的数据。