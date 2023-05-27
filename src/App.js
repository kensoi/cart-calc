import React from "react";
import { nanoid } from "nanoid";

import "./css/stylesheet.css";
import AppContent from "./components/Content";
import Header from "./components/Header";
import FormCard from "./components/FormCard";
import OverflowBG from "./components/OverflowBG";

import {getScreenDeviceType} from "./shared/";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      colorSchema: localStorage.getItem("colorSchema") || "dark",

      productList: JSON.parse(localStorage.getItem("product-list")) || [],
      inTotalMode: JSON.parse(localStorage.getItem("inTotalMode")) || false,
      availableMoney: JSON.parse(localStorage.getItem("available-money")) || 0,
      selectedProduct: null,

      cardTopOffset: 0,
      cardMounted: false,
      cardLoaded: true,
      cardLayout: "settings",
      cardResponse: JSON.parse(localStorage.getItem("latestResponse")) || {
        layout: "settings",
        response: null,
      },

      headerState: JSON.parse(localStorage.getItem("headerState")) || true,
    };
  }

  createToolkit() {
    this.toolkit = {
      cardMounted: this.state.cardMounted,
      cardLayout: this.state.cardLayout,
      cardResponse: this.state.cardResponse,
      cardTopOffset: this.state.cardTopOffset,
      cardLoaded: this.state.cardLoaded,
      selectedProduct: this.state.selectedProduct,

      setSelectedProduct: (state) => {
        this.setState({selectedProduct: state})
      },

      inTotalMode: this.state.inTotalMode,
      setTotalMode: (state) => {
        this.setState({
          inTotalMode: state
        })
        localStorage.setItem("inTotalMode", JSON.stringify(state));
      },

      getAvailableMoney: () => {
        return this.state.availableMoney
      },

      setAvailableMoney: (state) => {
        let money = parseFloat(state).toFixed(2)
        this.setState({
          availableMoney: money
        })
        localStorage.setItem("available-money", JSON.stringify(money));
      },
      getChange: () => {
        let change = this.toolkit.getAvailableMoney() - this.toolkit.getTotalCost();
        return change.toFixed(2)
      },

      showCard: (layout) => {
        var offset = 100;
        if (this.state.cardMounted) {
          this.toolkit.returnCardResponse(null);
          offset += 100;
        }

        setTimeout(() => {
          this.setState({
            cardLayout: layout,
            cardTopOffset: window.scrollY,
            cardMounted: true,
          });
        }, offset);

        setTimeout(() => {
          this.setState({
            cardLoaded: true,
          });
        }, 100 + offset);
      },

      returnCardResponse: (response) => {
        this.setState({
          cardResponse: {
            layout: this.state.cardLayout + "",
            response: response,
          },
          cardLoaded: false,
        });
        localStorage.setItem(
          "latestResponse",
          JSON.stringify({
            layout: this.state.cardLayout + "",
            response: response,
          })
        );
        window.scrollTo(window.scrollX, this.toolkit.cardTopOffset + 0);
        setTimeout(() => {
          this.setState({
            cardMounted: false,
          });
        }, 100);
      },
      colorSchema: this.state.colorSchema,
      setColorSchema: (schema) => {
        localStorage.setItem("colorSchema", schema);
        this.setState({
          colorSchema: schema,
        });
      },

      productList: this.state.productList,
      addProduct: (product) => {
        let productList = [{
          name: product.name,
          id: nanoid(),
          quantity: product.quantity,
          price: product.price
        }, ...this.state.productList]
        this.setState({
          productList: productList
        })
        localStorage.setItem("product-list", JSON.stringify(productList));
      },

      removeProduct: (productID) => {
        let productList = this.state.productList.filter(product => product.id !== productID)
        this.setState({
          productList: productList
        })
        localStorage.setItem("product-list", JSON.stringify(productList));
      },

      changeProduct: (productID, name=null, quantity=null, price=null) => {
        let productList = this.state.productList.map(
          item => {
            if (item.id !== productID) {
              return item
            }
            item.name = name
            item.quantity = quantity
            item.price = price
            
            return item
          })
          this.setState({
            productList: productList
          })
          localStorage.setItem("product-list", JSON.stringify(productList));
      },

      getTotalCost: () => {
        return this.state.productList.map(item => item.quantity * item.price).reduce((a, b) => a + b, 0)
      },
      clearList: () => {
        this.setState({productList: []})
      },

      enableHeader: this.state.headerState,
      setHeaderState: (state) => {
        this.setState({
          headerState: state,
        });
        localStorage.setItem(
          "headerState",
          JSON.stringify(this.state.headerState)
        );
      },
    }
  };
    

  showHelloMessage = () => {
    let helloMessage =
      JSON.parse(localStorage.getItem("HelloCartCalcMessage")) || false;

    if (!helloMessage) {
      localStorage.setItem("HelloCartCalcMessage", JSON.stringify(true));
      this.toolkit.showCard("hello");
    }
  };

  render() {
    this.createToolkit();

    this.layoutClassList = ["webx"]
    this.layoutClassList.push("color-schema-" + this.toolkit.colorSchema)
    this.layoutClassList.push(getScreenDeviceType())

    document.body.className = this.layoutClassList.join(" ");

    this.showHelloMessage();

    try {
      return (
        <>
          <Header toolkit={this.toolkit} />
          <AppContent toolkit={this.toolkit} />
          <OverflowBG toolkit={this.toolkit} />
          <FormCard toolkit={this.toolkit} />
        </>
      );
    } catch (error) {
      return (
        <>
          <h1>Error</h1>
          <p>{error}</p>
        </>
      );
    }
  }
}

export default App;
