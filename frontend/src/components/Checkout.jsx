import React from 'react';
import GiftsForm from 'components/GiftsForm';
import Cart from 'components/Cart';
import OrderForm from 'components/OrderForm';

import styles from 'styles/Checkout';

export class Checkout extends React.Component {
    render() {
        return (
            <div className={styles.wrapper}>
                <Cart/>
                <GiftsForm/>
                <OrderForm/>
            </div>
        )
    }
}

export default Checkout;