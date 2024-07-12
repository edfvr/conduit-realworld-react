import '../App.css'

export default function Banner(): JSX.Element{
    return (
        <div className="banner" show-authed="false">
            <div className="container">
                <h1 className="logo-font">conduit</h1>
                <p>A place to share your knowledge.</p>
            </div>
        </div>
    )
}