import React from 'react';


export default class History extends React.Component{
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
