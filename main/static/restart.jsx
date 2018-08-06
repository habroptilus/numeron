import React from 'react';

export default class Restart extends React.Component{
  render(){
      //引き分けで初期化
      let title_message=  "Draw..."
      let box_message="Another Game!"
      let className=['restart',"draw"].join(' ')

      //勝敗判定
      if (this.props.cpu_judge["H"]!=3){
          title_message=  "You Win!"
          box_message="Congratulations!!"
          className=['restart',"win"].join(' ')
      }else if(this.props.latest_judge["H"]!=3){
          title_message=  "You Lose..."
          box_message="Never Give Up!!"
          className=['restart',"lose"].join(' ')
      }

   return(
    <div className={className}>
      <div className="box-title">{title_message}</div>
       <p>{box_message}</p>
      <p>Trials : {this.props.count}</p>
       <a className="btn restart-btn" href="#" onClick={() => this.props.onClick()}>RESTART</a>
    </div>
   );
  }

}
