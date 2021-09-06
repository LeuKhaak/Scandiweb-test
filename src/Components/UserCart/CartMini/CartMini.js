import React from 'react';
import {NavLink} from 'react-router-dom';
import OverallData from '../../../Context';
import * as styles from './CartMini.module.css';
import createCartMiniList from './CartMiniUtils/CreateCartMiniLis';

class CartMini extends React.PureComponent {
  constructor(props) { 
    super(props);
    this.state = {
      jsonCart: '',
      currencySimbol: '$',
      total: '00.00'
    }	
  }

  createCartMiniList = (data) => createCartMiniList.call(this, data)

  checkOut() {
    if (!window.localStorage.getItem('cart')) return;

    const cart = window.localStorage.getItem('cart');
    const jsonCart = JSON.parse(cart)
    let total = 0

    const checkDeleted =  jsonCart.filter(item => item.amount > 0);

    checkDeleted.forEach((element) => {      
      total += element.prices[this.context.currencyNumber] * element.amount     
    });
    window.localStorage.setItem('cart', JSON.stringify(checkDeleted));

    this.setState({
      currencySimbol: this.context.currencySimbol,        
      total: total.toFixed(2),
      jsonCart: checkDeleted    
    })

    this.props.setMiniCartProductChanged('yes')
  }

  componentDidMount() {
    if (!window.localStorage.getItem('cart')) return;

    const cart = window.localStorage.getItem('cart');
    let jsonCart = JSON.parse(cart)

    this.setState({      
      jsonCart: JSON.parse(JSON.stringify(jsonCart))
    })
    this.checkOut()
    
    this.props.setMiniCartProductChanged('no')
  }

  componentDidUpdate() { 
    if (!window.localStorage.getItem('cart')) return;

    if (this.props.miniCartChanged !== 'no') {
      const cart = window.localStorage.getItem('cart');
      let jsonCart = JSON.parse(cart)

      this.setState({      
        jsonCart: JSON.parse(JSON.stringify(jsonCart))
      })
      
      this.checkOut()

      this.props.setMiniCartProductChanged('no')           
    }
  }

  render() {
    const {jsonCart, currencySimbol, total} = this.state
    return (
      <div className={styles.cartMiniWrapper}>                                     
        <div className={styles.cartMini}>
          <div className={styles.cartTitle}>My bag, <span>{jsonCart.length}</span><span> items</span></div>

          <div className={styles.cartMiniListWrapper}>
            <ul className={styles.productList}>
              {this.createCartMiniList(jsonCart)}
            </ul>
          </div>          

          <div className={styles.prodSumm}>
            <h4>Total</h4>
            <div className={styles.prodSummNumber}><span className={styles.priceNumber}>{currencySimbol}{total}</span></div>
          </div>

          <div className={styles.prodButtons}>
            <button onClick={() => {this.props.hideCartMini(); this.props.setSavedHref("/cart")}} className={styles.viewButton}>
              <NavLink className={styles.cartLink} to="/cart">
                View bag
              </NavLink>              
            </button>

            <button onClick={() => this.checkOut()} className={styles.checkButton}>Check out</button>
          </div>
        </div>
      </div>     
    ); 
  } 
}

CartMini.contextType = OverallData;

export default CartMini;