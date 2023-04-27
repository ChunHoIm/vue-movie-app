import { createRouter, createWebHashHistory } from "vue-router";
import Home from "./Home";
import Movie from "./Movie";
import About from "./About";
import NotFound from "./NotFound";

export default createRouter({
    // Hash, History
    // Hash 모드로 사용시 /#/이용하여 접근 (서버X)
    history: createWebHashHistory(),
    // Pages
    routes: [
        {
            path: "/",
            component: Home
        },
        {
            path: "/movie/:movieId",
            component: Movie
        },
        {
            path: "/about",
            component: About
        },
        {
            path: "/:notFount(.*)",
            component: NotFound
        }
    ],
    scrollBehavior() {
        // always scroll to top
        return { top: 0 }
    },
});