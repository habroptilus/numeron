import React from 'react';


export default class Delete extends React.Component{
  render(){
    return(
     <div className="delete col-xs-3 col-xs-offset-3">
      <a className="btn delete-btn " href="#" onClick={() => this.props.onClick()}>DEL</a>
      </div>
    );
  }
}
