import React from 'react';
import ReactDOM from 'react-dom';
import Request from 'superagent';

import Post from './post.jsx';
import Answer from './answer.jsx';
import History from './history.jsx';
import Button  from './button.jsx';
import Delete from './delete.jsx';
import Form from './form.jsx';
import Restart from './restart.jsx';
import Square from './square.jsx';

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
     const correct=this.state.finished ? this.state.correct : "???"
     const cpu_correct=this.state.cpu_correct
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
          <div className="col-xs-3"><History history={this.state.history} correct={cpu_correct} player="YOU" /></div>
          <div className="col-xs-3"><History history={this.state.cpu_history} correct={correct} player="CPU" /></div>
        </div>
      </div>
    );
  }
}









ReactDOM.render(<Main />, document.getElementById('react-container'));
