import React from 'react';
import { connect } from 'react-redux';

import map from 'lodash/map';
import { foodItemAnnotatedCart } from 'selectors/app';

import { Card } from 'react-toolbox/lib/card';

import CartTotal from 'components/CartTotal';
import CartQuantityButtons from 'components/CartQuantityButtons';

import styles from '../styles/checkout.css';
import cardStyles from '../styles/cart-card.css';


class CartItem extends React.Component {
    render() {
        const {foodItemId, foodItem, quantity} = this.props;
        // const {price} = foodItem;
        return (foodItem
                ? <Card theme={cardStyles}>
                    <CartQuantityButtons
                        foodItemId={foodItemId}
                        quantity={quantity}
                        foodItemTitle={foodItem.title}
                    />
                    <div styleName="styles.food-title">
                        {quantity} × {foodItem.title}:
                    </div>
                    <p>{foodItem.price * quantity}₸</p>
                </Card >
                : null
        )
    }
}


export class Cart extends React.Component {
    render() {
        const {annotatedCart} = this.props;
        return (
            <div>
                CART:
                {map(annotatedCart, ({quantity, foodItem}, foodItemId) =>
                    <CartItem
                        key={foodItemId}
                        foodItemId={foodItemId}
                        foodItem={foodItem}
                        quantity={quantity}
                    />
                )}
                <CartTotal/>
            </div>
        )
    }
}

export default connect(
    state => ({
        annotatedCart: foodItemAnnotatedCart(state),
    }),
)(Cart)