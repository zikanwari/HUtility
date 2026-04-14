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
      <div className="cell class">
        <div>{data.subject}</div>
        <div>{data.teacher}</div>
        <div>{data.room}</div>
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
          <div id="timetable">
            {time.map((period) => (
              period.cells.map((cell) => (
                <Cell data={cell} />
              ))
            ))}
          </div>
        </div>
      </section>
  )
}

export default App