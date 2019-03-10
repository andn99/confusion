import React, {Component} from 'react';
import {Card, CardTitle, CardText, CardBody, CardImg, CardImgOverlay} from 'reactstrap';

class Menu extends Component{
    constructor(props){
        super(props);
        this.state = {
            selectedDish : null
        }
    }

    renderSelectedDish(dish){
        if(!dish)
            return (<div></div>)
        
        return (
            <Card>
                <CardImg top src = {dish.image} alt = {dish.name}></CardImg>
                <CardBody>
                    <CardTitle>{dish.name}</CardTitle>
                    <CardText>{dish.description}</CardText>
                </CardBody>

            </Card>
        );
    }
    render() {
        const menu = this.props.dishes.map(dish => {
            return (
                <div key = {dish.id} className = 'col-12 col-md-5 m-1'>
                    <Card key = {dish.id} onClick = {() => this.setState({selectedDish: dish})}>
                        <CardImg src = {dish.image}></CardImg>
                        <CardImgOverlay>
                            <CardTitle>{dish.name}</CardTitle>
                        </CardImgOverlay>
                    </Card>
                </div>
            );
        })
        return (
            <div className = 'container'>
                <div className = 'row'>
                    {menu}
                </div>
                <div className="row">
                  <div  className="col-12 col-md-5 m-1">
                    {this.renderSelectedDish(this.state.selectedDish)}
                  </div>
                </div>
            </div>
        );
    }
}

export default Menu;