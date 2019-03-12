import React from 'react';
import {Card, CardTitle, CardImg, CardImgOverlay} from 'reactstrap';

const RenderMenuItem = ({dish, onClick}) => {
    return (
        <Card key = {dish.id} onClick = {() => onClick(dish.id)}>
            <CardImg src = {dish.image}></CardImg>
            <CardImgOverlay>
                <CardTitle>{dish.name}</CardTitle>
            </CardImgOverlay>
        </Card>
    );
}

const Menu = (props) => {
    const menu = props.dishes.map((dish) => {
        return(
            <div key = {dish.id} className = 'col-12 col-md-5 m-1'>
                <RenderMenuItem dish = {dish} onClick = {props.onClick}></RenderMenuItem>
            </div>
        )
    })
    return (
        <div className = 'container'>
            <div className = 'row'>
                {menu}
            </div>
        </div>
    );
}

export default Menu;