import React from 'react';


export default class Delete extends React.Component{
  render(){
    return(
     <div className="col-xs-2 col-xs-offset-3">
      <a className="footer-btn delete-btn " href="#" onClick={() => this.props.onClick()}>DEL</a>
      </div>
    );
  }
}
