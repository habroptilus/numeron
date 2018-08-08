import React from 'react';


export default class Post extends React.Component{
  render(){
    return(
      <div className="col-xs-2">
      <a className="footer-btn post-btn " href="#" onClick={() => this.props.onClick()}>TRY</a>
      </div>
    );
  }
}
