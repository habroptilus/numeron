import React from 'react';


export default class Post extends React.Component{
  render(){
    return(
      <div className="post col-xs-3 col-xs-3-offset-3">
      <a className="btn post-btn " href="#" onClick={() => this.props.onClick()}>TRY</a>
      </div>
    );
  }
}
