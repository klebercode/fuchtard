import React from 'react';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';
import {Card, CardMedia, CardTitle, CardText, CardActions} from 'react-toolbox/lib/card';
import { Button } from 'react-toolbox/lib/button';
import FontIcon from 'react-toolbox/lib/font_icon';
import styles from '../styles/food-item.css';
import cardStyles from '../styles/food-item-card.css';

import { actions as cartActions } from 'reducers/cart';
import { getCategoryBySlug, getQuantityByFoodId, getFoodItemsBySlugOrID } from 'selectors/app';


@connect(
    (state, props) => ({
        quantity: getQuantityByFoodId(state, props),
    }),
    (dispatch, props) => ({
        plusButton: () => dispatch(cartActions.plusButton(props.foodItemId)),
        minusButton: () => dispatch(cartActions.minusButton(props.foodItemId)),
    })
)
class FoodQuantityButtons extends React.Component {
    render() {
        const {quantity, plusButton, minusButton} = this.props;
        return (
            <div>
                {quantity >= 1 &&
                <Button className="quantity-button" raised onClick={minusButton}>
                    <span className="plusminus">−</span>
                </Button>
                }
                {quantity >= 1 &&
                <span>{quantity}</span>
                }
                <Button className="quantity-button" raised disabled={quantity >= 9} onClick={plusButton}>
                    {!quantity || quantity < 1
                        ? <FontIcon value="add_shopping_cart"/>
                        : <span className="plusminus">+</span>}
                </Button>
            </div>
        )
    }
}


export class FoodItem extends React.Component {
    render() {
        const {food, category} = this.props;
        return (food
                ? <div styleName="styles.item-wrapper">
                    <Card theme={cardStyles}>
                        <div>
                            <CardMedia
                                aspectRatio="wide"
                                image={food.photo}
                            />
                            <CardTitle
                                title={
                                    <Link to={`/${category.slug}/${food.slug || food.id}/`}>
                                        {food.title}
                                    </Link>
                                }
                                subtitle={food.description}
                            />
                        </div>
                        <div styleName="styles.pricing">
                            <div>
                                {food.raw_price > food.price && <p styleName="styles.old-price">{food.raw_price}₸</p>}
                                <p>{food.price}₸</p>
                            </div>
                            <div>
                                <FoodQuantityButtons foodItemId={food.id}/>
                            </div>
                        </div>
                    </Card>
                </div>
                : null
        )
    }
}

@connect(
    (state, props) => ({
        food: getFoodItemsBySlugOrID(state, props),
        category: getCategoryBySlug(state, props),
    })
)
export class FoodItemDetails extends React.Component {
    render() {
        const {food, category} = this.props;
        return <div>
            <Link to={`/${category.slug}/`}>← {category.title}</Link>
            <FoodItem food={food} category={category}/>
        </div>
    }
}