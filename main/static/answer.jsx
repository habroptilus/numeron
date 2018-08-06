import React from 'react';
import Square from './square.jsx';

export default class Answer extends React.Component{

  renderSquare(i) {
    return <Square value={this.props.answer[i]}/>;
  }

  render(){
    return(
      <div className="answer">
        <div className="row">
          <div className="col-xs-2 col-xs-offset-3">
            {this.renderSquare(0)}
          </div>
          <div className="col-xs-2">
            {this.renderSquare(1)}
          </div>
          <div className="col-xs-2">
            {this.renderSquare(2)}
          </div>
        </div>
      </div>
    );
  }
}
