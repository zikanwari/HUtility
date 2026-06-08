import '../../assets/menu.css'
type Props = {
    setTab: (tab: string) => void
}

function SimpleMenu({ title }: { title: string } ) {
    return (
        <div className="menu">
            <h3>
                {title}
            </h3>
        </div>
    )
}

export default function Other({ setTab }: Props) {
    return (
        <>
            <div onClick={() => setTab('bus-timer')}>
                <SimpleMenu title="バス時刻表"/>
            </div>
            <div onClick={() => setTab('settings')}>
                <SimpleMenu title="設定"/>
            </div>
        </>
    )
}