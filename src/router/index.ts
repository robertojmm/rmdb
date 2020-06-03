import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import AddMovie from "@/views/Add.vue";
import Library from "@/views/Library.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/add",
    name: "Add Movie",
    component: AddMovie,
  },
  {
    path: "*",
    redirect: "/library",
  },
  {
    path: "/",
    redirect: "/library",
  },
  {
    path: "/library",
    name: "Library",
    component: Library,
  },
  {
    path: "/settings",
    name: "Settings",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Settings.vue"),
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
