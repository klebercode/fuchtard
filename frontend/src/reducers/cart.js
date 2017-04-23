import Immutable from 'seamless-immutable';
import { actions as notificationActions } from 'reducers/notifications';
import { actions as uiActions } from 'reducers/ui';
import { foodItemAnnotatedCart, cartSelector } from 'selectors/app';


const types = {
    CLEAR_CART: 'CLEAR_CART',
    CART_ITEM_ADD: 'CART_ITEM_ADD',
    CART_ITEM_INCREASE: 'CART_ITEM_INCREASE',
    CART_ITEM_DECREASE: 'CART_ITEM_DECREASE',
    CART_ITEM_REMOVE: 'CART_ITEM_REMOVE',
    REVERT_CART: 'REVERT_CART',
};

function getCartFromLocalStorage() {
    const cart = window.localStorage.getItem('cart');
    try {
        return JSON.parse(window.localStorage.getItem('cart'));
    }
    catch (e) {
        console.log(e)
    }
    return {
        foodItems: {},
        ordering: [],
    }
}

const initialState = Immutable({
    present: getCartFromLocalStorage(),
    previous: {},
});


const backedUpCartState = (state) => Immutable.set(state, 'previous', state.present);


export default function (state=initialState, action) {
    switch (action.type) {
        case types.CLEAR_CART:
            return Immutable.set(backedUpCartState(state), 'present', {});
        case types.CART_ITEM_ADD:
            const addedToOrdering = Immutable.updateIn(
                backedUpCartState(state), ['present', 'ordering'], v => [...v, action.payload]
            );
            return Immutable.setIn(addedToOrdering, ['present', 'foodItems', action.payload], 1);
        case types.CART_ITEM_INCREASE:
            return Immutable.updateIn(backedUpCartState(state), ['present', 'foodItems', action.payload], v => v + 1);
        case types.CART_ITEM_DECREASE:
            return Immutable.updateIn(backedUpCartState(state), ['present', 'foodItems', action.payload], v => v - 1);
        case types.CART_ITEM_REMOVE:
            const removedFromOrdering = Immutable.updateIn(
                backedUpCartState(state),
                ['present', 'ordering'],
                ordering => ordering.filter(v => v !== action.payload)
            );
            return Immutable.updateIn(removedFromOrdering, ['present', 'foodItems'], v => Immutable.without(v, action.payload));
        case types.REVERT_CART:
            return Immutable.set(state, 'present', state.previous);
        default:
            return state;
    }
};

function cartItemAdd(foodItemId) {
    return {
        type: types.CART_ITEM_ADD,
        payload: foodItemId,
    }
}

function cartItemIncrease(foodItemId) {
    return {
        type: types.CART_ITEM_INCREASE,
        payload: foodItemId,
    }
}

function cartItemDecrease(foodItemId) {
    return {
        type: types.CART_ITEM_DECREASE,
        payload: foodItemId,
    }
}

function cartItemRemove(foodItemId) {
    return {
        type: types.CART_ITEM_REMOVE,
        payload: foodItemId,
    }
}


function clearCart() {
    return dispatch => {
        dispatch(notificationActions.notify('Корзина очищена'));
        dispatch({type: types.CLEAR_CART});
    }
}


function plusButton(foodItemId) {
    return (dispatch, getState) => {
        const state = getState();
        const quantity = cartSelector(state)[foodItemId];
        if (quantity >= 1) {
            dispatch(cartItemIncrease(foodItemId));
        } else {
            dispatch(cartItemAdd(foodItemId));
            dispatch(uiActions.expandedCartItemSet(foodItemId));
        }
    }
}

function minusButton(foodItemId) {
    return (dispatch, getState) => {
        const state = getState();
        const {quantity, foodItem: {title}} = foodItemAnnotatedCart(state)[foodItemId];
        if (quantity === 1) {
            dispatch(notificationActions.notify(`Блюдо ${title} удалено из корзины`));
            dispatch(cartItemRemove(foodItemId));
        } else {
            dispatch(cartItemDecrease(foodItemId));
        }
    }
}

function revertCart() {
    return {type: types.REVERT_CART}
}


export const actions = {
    clearCart,
    plusButton,
    minusButton,
    revertCart,
};