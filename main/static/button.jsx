import React from 'react';


export default class Button extends React.Component {

  render(){
    const className=['button',this.props.selected ? "disabled" : null].join(' ')


    return (
    <a className={className}   href="#" onClick={() => this.props.onClick()}>
      {this.props.value}
    </a>
  );

  }

}
