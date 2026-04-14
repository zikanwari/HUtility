import './App.css'
import timedata from './assets/time.json'
import sample from './assets/sample.json'

interface Period {
  name: string;
  cells: (ClassCell | OthersCell)[];
}

interface OthersCell {
  type: "same" | "empty"
  raw: "上記と同じ" | "空き"
}

interface ClassCell {
  type: "class";
  subject: string;
  teacher: string;
  room?: string;
};

function Cell({ data }: { data: ClassCell | OthersCell }) {
  if (data.type === 'class') {
    return (
      <div className="cell">
        <div className="class-name">{data.subject}</div>
        <div className="teacher">{data.teacher}</div>
        <div className="room">{data.room}</div>
      </div>
    )
  } else {
    return <div className={`cell ${data.type}`}>{data.raw}</div>
  }
}

function Time({ name }: { name: string }) {
  const timeData = timedata.find((t) => t.period === name);
  return <div className="time">{timeData?.time}</div>;
}

function App() {
  //var time = localStorage.getItem('time')
  var time = sample as Period[]

  return (
      <section>
        <div>
          <h1>HUtility</h1>
        </div>
        <div>
          <h2>時間割</h2>
          <div className="timetable">
            <div />
            <div className="header">月</div>
            <div className="header">火</div>
            <div className="header">水</div>
            <div className="header">木</div>
            <div className="header">金</div>
            {time.map((period) => (
              
              <>
                <div className="period">{period.name}
                  <Time name={period.name} />
                </div>
                {period.cells.map((cell) => (
                  <Cell data={cell} />
                ))}
              </>
            ))}
          </div>
        </div>
      </section>
  )
}

export default App