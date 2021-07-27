import React from 'react';
import { client, Query, Field } from "@tilework/opus";
import {NavLink} from 'react-router-dom';
import OverallData from '../../../Context';
import * as styles from './Categ.module.css';

class Categ extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentCategoryData: '',
      location: ''
    }

    this.createList = this.createList.bind(this)
  }

  createList() {    
    return this.state.currentCategoryData && this.state.currentCategoryData.map(item =>
      <li className={styles.productItem} id={item.id} key={item.id}>
        <NavLink className={styles.prodLink} to={"/product/" + item.id}> 
          <img className={styles.imgProd} src={item.gallery[0] || item.gallery} alt="#"/>
        </NavLink>

        <h3 className={styles.prodTitle}>{item.brand} <span className={styles.subtitle}>{item.name}</span></h3>                

        <div className={styles.prodPrice}><span>{this.context.currencySimbol}</span><span className={styles.priceNumber}>{item.prices[this.context.currencyNumber].amount}</span></div>

        <button onClick={() => this.props.addToCart(item.inStock, item.id)} className={(item.inStock ? styles.prodAdd : styles.inStockFalse)}><span className={styles.cartIcon}><span className={styles.redLine}></span></span></button>       
      </li>
    )
  }

  

  changeCategory() {

  }
  
  componentDidMount() {  
    const fromHref = window.location.href.split('/')[4];
    //console.log(fromHref)
        
    client.setEndpoint("http://localhost:4000/graphql");    
  
    const query = new Query("category", true)
      .addArgument("input", "CategoryInput", { title : fromHref})
      .addField(new Field("products", arguments.title, true).addFieldList(["id", "name", "brand", "inStock", "gallery", "prices {currency,amount }"]))
  
      client.post(query).then(result => {
        const newData = result.category.products
        this.setState({
        ...this.state,        
        currentCategoryData: newData           
      });     
    });    
  }

  componentDidUpdate(_, prevState) {
    if (window.location.pathname !== prevState.location) {
      const fromHref = window.location.href.split('/')[4];
      //console.log(fromHref)
          
      client.setEndpoint("http://localhost:4000/graphql");    
    
      const query = new Query("category", true)
        .addArgument("input", "CategoryInput", { title : fromHref})
        .addField(new Field("products", arguments.title, true).addFieldList(["id", "name", "brand", "inStock", "gallery", "prices {currency,amount }"]))
    
        client.post(query).then(result => {
          const newData = result.category.products
          this.setState({
          ...this.state,
          location: window.location.pathname,        
          currentCategoryData: newData           
        });     
      });
    }   
  }

  render() {
    return (
      <section className="men">
          <div className="container">
            <h3 className={styles.title}>{this.props.currentCategory}</h3>
            <ul className={styles.products}>
             {this.createList()}             
            </ul>
          </div>
      </section>
    );
  } 
}

Categ.contextType = OverallData;

export default Categ;