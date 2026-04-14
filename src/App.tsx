import './App.css'
import sample from './assets/sample.json'

interface Period {
  period: string;
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

function App() {
  //var time = localStorage.getItem('time')
  var time = sample as Period[]

  return (
      <section id="center">
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
            {time.map((period) => (              period.cells.map((cell) => (
                <Cell data={cell} />
              ))
            ))}
          </div>
        </div>
      </section>
  )
}

export default App