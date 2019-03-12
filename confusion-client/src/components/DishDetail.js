import React, {Component} from 'react';
import {Card, CardImg, CardBody, CardTitle, CardText} from 'reactstrap';

const RenderComment = ({comment}) => {
    return (
        <div key = {comment.id}>
            <p>{comment.comment}</p>
            <p>--{comment.author}, {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).format(new Date(Date.parse(comment.date)))}</p>
        </div>
    );
}

const RenderDishDetail = ({dish}) => {
    return (
        <Card>
            <CardImg top src = {dish.image} alt = {dish.name}></CardImg>
            <CardBody>
                <CardTitle>{dish.name}</CardTitle>
                <CardText>{dish.description}</CardText>
            </CardBody>

        </Card>);
}
const DishDetail = (props) => {
    if(!props.dish)
        return (<div></div>)

    const comments = props.dish.comments.map((comment) => {
        return(
            <RenderComment comment = {comment}/>
        )
    })

    return (
        <div className = 'container'>
            <div className = 'row'>
                <div className = 'col-12 col-md-5 m-1'>
                    <RenderDishDetail dish = {props.dish}></RenderDishDetail>
                </div>
                <div className = 'col-12 col-md-5 m-1'>
                    <h4>Comments</h4>
                    {comments}
                </div>
            </div>
        </div>
        
    );
}


export default DishDetail;