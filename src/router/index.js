
import Vue from 'vue'
import Router from 'vue-router'
import Course from '../Course.vue'
import Search from '../Search.vue'
import Professor from '../Professor.vue'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/search',
      name: 'SearchIndex',
    },
    { 
      path: '/course', 
      name: 'CoursePage',
      component: Course,
      props: (route) => ({ 
        term: route.query.term, 
        subject: route.query.subject, 
        number: route.query.number 
      })
    },
    { 
      path: '/search', 
      name: 'SearchPage',
      component: Search,
      props: (route) => ({ 
        term: route.query.term, 
        subject: route.query.subject, 
        number: route.query.number 
      })
    },
    { 
      path: '/professor', 
      name: 'ProfessorPage',
      component: Professor,
      props: (route) => ({ 
        pid: route.query.pid, 
        term: route.query.term, 
        subject: route.query.subject, 
        number: route.query.number 
      })
    }]
});

export default router
