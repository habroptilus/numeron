import React from 'react';
import Button from './button.jsx'

export default class Form extends React.Component{

  renderButton(i) {
    return <Button selected={this.props.buttons[i]} value={i} onClick={() => this.props.onClick(i)} />;
  }

  render(){
    return(
       <div className="form">
          <div className="row">
            <div className="col-xs-2 col-xs-offset-3">
              {this.renderButton(1)}
             </div>
            <div className="col-xs-2">
            {this.renderButton(2)}
          </div>
          <div className="col-xs-2">
            {this.renderButton(3)}
          </div>
        </div>
        <div className="row">
          <div className="col-xs-2 col-xs-offset-3">
              {this.renderButton(4)}
             </div>
            <div className="col-xs-2">
            {this.renderButton(5)}
          </div>
          <div className="col-xs-2">
            {this.renderButton(6)}
          </div>

        </div>
        <div className="row">
          <div className="col-xs-2 col-xs-offset-3">
              {this.renderButton(7)}
             </div>
            <div className="col-xs-2">
            {this.renderButton(8)}
          </div>
          <div className="col-xs-2">
            {this.renderButton(9)}
          </div>
        </div>
        <div className="row">
          <div className="col-xs-2 col-xs-offset-3">
             <div className="button none"></div>
             </div>
            <div className="col-xs-2">
            {this.renderButton(0)}
          </div>
          <div className="col-xs-2">
           <div className="button none" ></div>
          </div>
        </div>
      </div>
    );
  }
}
