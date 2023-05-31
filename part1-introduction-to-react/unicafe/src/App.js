import { useState } from 'react';

const StatisticLine = ({ text, value }) => {
  if (text === 'positive') {
    return (
      <tr>
        <td>{text}</td>
        <td>{value} %</td>
      </tr>
    );
  }
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  );
};

const Statistics = (props) => {
  const { good, neutral, bad, avg } = props;
  if (good === 0 && neutral === 0 && bad === 0) {
    return (
      <>
        <p>No feedback given.</p>
      </>
    );
  }

  return (
    <table>
      <tbody>
        <StatisticLine text={'good'} value={good} />
        <StatisticLine text={'neutral'} value={neutral} />
        <StatisticLine text={'bad'} value={bad} />
        <StatisticLine text={'all'} value={good + neutral + bad} />
        <StatisticLine text={'avg'} value={avg / (good + neutral + bad) || 0} />
        <StatisticLine
          text={'positive'}
          value={(good / (good + neutral + bad)) * 100 || 0}
        />
      </tbody>
    </table>
  );
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [avg, setAvg] = useState(0);

  const handleGoodClick = () => {
    setGood(good + 1);
    setAvg(avg + 1);
  };
  const handleNeutralClick = () => {
    setNeutral(neutral + 1);
  };
  const handleBadClick = () => {
    setBad(bad + 1);
    setAvg(avg - 1);
  };

  return (
    <>
      <h1>give feedback</h1>
      <button onClick={handleGoodClick}>good</button>
      <button onClick={handleNeutralClick}>neutral</button>
      <button onClick={handleBadClick}>bad</button>
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} avg={avg} />
    </>
  );
};

export default App;
