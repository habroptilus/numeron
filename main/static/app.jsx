import React from 'react';
import ReactDOM from 'react-dom';
import Request from 'superagent';



class Main extends React.Component{
  constructor(){
    const history=[];
    const cpu_history=[];
    const buttons=Array(9).fill(false)
    const answer=Array(3).fill(null)
    const cpu_answer=Array(3).fill(null)
    const filled=0
    super()
    const correct=this.createCorrect()
    const cpu_correct=this.createCorrect()//とりあえず自分の答えもランダムにつくってしまう
    this.state={
      history:[],//人間側のトライ・ジャッジの履歴
      cpu_history:[],//CPU側のトライ・ジャッジの履歴
      finished:false,
      buttons:buttons,
      answer:answer,//人間がトライする数字
      cpu_answer:cpu_answer,
      filled:filled,
      correct:correct,//人間側が答えるべき正解の数字
      cpu_correct:cpu_correct,//CPUが答えるべき正解の数字
      latest_judge:null,
      latest_cpu_judge:null
    }

    this.cpu_action = this.cpu_action.bind(this);
  }

  createCorrect(){
    var array = [0,1,2,3,4,5,6,7,8,9];
    var correct=[];
    var idx=null;
    for (var i=0; i< 3; i++){
      idx=Math.floor(Math.random() * array.length)
      correct.push(array[idx])
      array.splice(idx,1)
    }
    return correct
  }

  handleClick(i){
    var filled = this.state.filled+1;
    if (filled !=4){
     var buttons = this.state.buttons.slice();
    buttons[i]=true;
    var answer=this.state.answer.slice();

    answer[this.state.filled]=i;
    this.setState({
    buttons:buttons,
    answer:answer,
    filled:filled
  });
    }
  }
  handleDelete(){
    var filled=this.state.filled;
    if (filled != 0){
      var answer=this.state.answer.slice();
      var buttons = this.state.buttons.slice();
      var value= this.state.answer.slice()[filled-1];
      buttons[value]=false;
      answer[filled-1]=null;
      filled=filled-1;
      this.setState({
        filled:filled,
        buttons:buttons,
        answer:answer,
      });
    }

  }

  judge(answer,correct){
    var hit=0;
    var bite=0;
    for (var i=0; i< 3; i++){
     for (var j=0; j< 3; j++){
        if (answer[j]==correct[i]){
          if (i==j){
            hit+=1
          }else{
            bite+=1
          }
        }
      }
    }
    return {H:hit,B:bite}
  }


  handlePost(){
    if (this.state.filled == 3){
      var history=this.state.history;
      const man_judge=this.judge(this.state.answer,this.state.correct)
      const id=history.length+1;
    history.push(
      {
       id:id,
       try:this.state.answer,
       judge:man_judge
      }
    );

    const finished = man_judge["H"]==3
    //state更新
    this.setState({
        filled:0,
        buttons:Array(9).fill(false),
        answer:Array(3).fill(null),
        history:history,
        finished:finished,
        latest_judge:man_judge
      });

    //CPUのターン
    this.cpu_action()
    }
  }


  handleRestart(){
     // const cpu_answer=this.getCPUAnswer()
    this.setState({
        filled:0,
        buttons:Array(9).fill(false),
        answer:Array(3).fill(null),
        cpu_answer:Array(3).fill(null),
        history:[],
        cpu_history:[],
        correct:this.createCorrect(),
        cpu_correct:this.createCorrect(),
        finished:false,
      });
    }

  cpu_action(){
      //オブジェクトの配列のままだと送れなかったのでjsonに
      const send_data=JSON.stringify(this.state.cpu_history)
      Request
        .get("/api/json")
        .query({history:send_data})
        .end((err, res)=>{
            const hoge=res.body["answer"].split("")
            const cpu_answer=hoge.map(function(value) {
                return Number(value);
            });


            var cpu_history=this.state.cpu_history;
            const id=cpu_history.length+1;
            const cpu_judge=this.judge(cpu_answer,this.state.cpu_correct)
            cpu_history.push(
              {
               id:id,
               try:cpu_answer,
               judge:cpu_judge
              }
            );
            const finished = cpu_judge["H"]==3
            this.setState({
                cpu_history:cpu_history,
                finished:finished,
                latest_cpu_judge:cpu_judge
            });
        });
      }


  render(){
     const count =this.state.history.length
     const latest_judge=this.state.latest_judge
     const latest_cpu_judge=this.state.latest_cpu_judge
     const restart = this.state.finished ?<div className="col-xs-6">
          <Restart count={count} latest_judge={latest_judge} cpu_judge={latest_cpu_judge} onClick={this.handleRestart.bind(this)} />
        </div> : <div className="col-xs-6">
            <div className="row">
              <Answer answer={this.state.answer} />
            </div>
            <div className="row">
               <Form buttons={this.state.buttons} onClick={(i) => this.handleClick.bind(this)(i)} />
            </div>
            <div className="row btnrow">
              <div ><Delete onClick={this.handleDelete.bind(this)} /></div>
              <div ><Post onClick={this.handlePost.bind(this)} /></div>
            </div>
          </div>;
    return(
      <div className="main">
        <div className="row">
          {restart}
          <div className="col-xs-3"><History history={this.state.history} player="YOU" /></div>
          <div className="col-xs-3"><History history={this.state.cpu_history} player="CPU" /></div>
        </div>
      </div>
    );
  }
}


class Delete extends React.Component{
  render(){
    return(
     <div className="delete col-xs-3 col-xs-offset-3">
      <a className="btn delete-btn " href="#" onClick={() => this.props.onClick()}>DEL</a>
      </div>
    );
  }
}

class Post extends React.Component{
  render(){
    return(
      <div className="post col-xs-3 col-xs-3-offset-3">
      <a className="btn post-btn " href="#" onClick={() => this.props.onClick()}>TRY</a>
      </div>
    );
  }

}

function Square(props) {
  return (
    <button className="square">
      {props.value}
    </button>
  );
}



class Answer extends React.Component{

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

class Form extends React.Component{

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

class Button extends React.Component {

  render(){
    const className=['button',this.props.selected ? "disabled" : null].join(' ')


    return (
    <a className={className}   href="#" onClick={() => this.props.onClick()}>
      {this.props.value}
    </a>
  );

  }

}

class History extends React.Component{
  render(){
    const history = this.props.history.map(result=>
         <tr key={result.id} className="result">
              <td className="try">{result.try}</td>
              <td className="judge">{result.judge.H}H{result.judge.B}B</td>
         </tr>
    )
    const player=this.props.player

    return(
      <div className="history">
           <table className="history-table">
                  <thead><tr><td colSpan="2">{player}</td></tr></thead>
                  <tbody>{history}</tbody>
           </table>
      </div>
    );
  }

}

class Restart extends React.Component{
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

ReactDOM.render(<Main />, document.getElementById('react-container'));
