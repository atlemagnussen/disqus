import "@appnest/web-router"

import "./views"
import "./components"
import "./buttons"
import "./layout.css"
import "./vars.css"
import "./index.css"
import { ThreadView } from "./views/threadView"
import { RoutingInfo } from "@appnest/web-router"
import { loadingForums } from "./services/config"

const defaultView = () => {
    return document.createElement("search-view")
}

loadingForums().then(() => {
    bootStrap()
})

function bootStrap() {
    customElements.whenDefined("router-slot").then(() => {
        const routerSlot = document.querySelector("router-slot")
        if (!routerSlot)
            return
        routerSlot.add([
            {
                path: "search",
                component: defaultView()
            },
            {
                path: "thread/:forum/:threadId",
                component: document.createElement("thread-view"),
                /// @ts-ignore
                setup: (component: ThreadView, info: RoutingInfo) => {
                    component.forum = info.match.params.forum;
                    component.thread = info.match.params.threadId;
                }
            },
            {
                path: "about",
                component: document.createElement("about-view")
            },
            {
                path: "stats",
                component: document.createElement("stats-view")
            },
            {
                path: "hall",
                component: document.createElement("hall-view")
            },
            {
                path: "**",
                redirectTo: "search"
            }
        ])
    })    
}

// <comments-view></comments-view>