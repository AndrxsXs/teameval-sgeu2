import TopNavbar from "../components/TopNavbar"
import Typography from "@mui/joy/Typography"
import PhotoHomePage from '../assets/photoHomePage.png'
import '../styles/pages/HomePage.css'
import Button from "@mui/joy/Button"

export default function HomePage() {
    return (
        <>
            <TopNavbar />
            <main>
                <article>
                    <section className="presentation">
                        <Typography level="title-lg" color="primary">
                            El poder de hacer más
                        </Typography>
                        <Typography level="h1">
                            La mejor manera de evaluar el talento
                        </Typography>
                        <Typography level="body-md">
                            Con TeamEval puedes agilizar la forma en que evalúas a tus compañeros de equipo.
                        </Typography>
                        <div>
                            <Button component="a" href="/login/">Entrar</Button>
                        </div>
                    </section>
                    <section>
                        <img className="img-home" src={PhotoHomePage} alt="" />
                    </section>
                </article>
            </main>
        </>
    )
}