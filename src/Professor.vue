<template>
  <div>
    <div class="columns" style="padding-top:15px">
      <div class="column is-1"></div>
      <div class="column">
        <h1 style="float:left; padding: 0px; padding-right:10px;"><a href="/">MockSched</a></h1>
        <div class="search-box">  
          <div>
            <select v-model="selected_term" id="terms">
              <option disabled value="">Please select one</option>
              <option v-for="term in terms" v-bind:value="term.stream">
                {{ term.description }}
              </option>
            </select>
            <select v-model="selected_subject" id="subjects">
              <option value="">Please select one</option>
              <option v-for="subject in subjects" v-bind:value="subject.subject">
                {{ subject.subject }}
              </option>
            </select>
            <select v-model="selected_domain" id="domains">
              <option value="">Learning Domain</option>
              <option v-for="domain in learning_domains" v-bind:value="domain.value">
                {{ domain.name }}
              </option>
            </select>
            <input placeholder="Course Number" v-bind:value="selected_number" v-on:keyup.enter="search" v-on:input="selected_number = $event.target.value" />
            <input class="search-button" type="submit" value="SEARCH" v-on:click="search()">
          </div>
        </div>
      </div>
      <div class="column is-1"></div>
    </div>

    <div class="columns">
      <div class="column is-1"></div>
      <div class="column">
        <div>
          <div class="header">{{professor.first_name + ' ' + professor.last_name}}</div>
          <hr>
          <div>
            <h2>
              <div>Overall Quality: {{professor.overall_score}}</div>
              <div>Helpfulness: {{professor.helpful_score}}</div>
              <div>Clarity: {{professor.clarity_score}}</div>
              <div>Easiness: {{professor.easy_score}}</div>
            </h2>
          </div>
          <hr>
        </div>
      </div>
    </div>
    <div v-for="r in professor.reviews">
      <div class="columns" style="padding-bottom:20px">
        <div class="column is-1"></div>
        <div class="column is-3">
            Date: {{r.date.replace(' 00:00:00 GMT','')}}<br>
            Class Name: {{r.class}}<br>
            Helpfulness: {{r.helpful}}<br>
            Clarity: {{r.clarity}}<br>
            Easiness: {{r.easy}}<br>
            Grade Received: {{r.grade}}<br>
        </div>
        <div id="column">
          <div>
            {{r.comments}}
          </div>
        </div>
        <div class="column is-1"></div>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    props: ['term','subject','number','pid','domain'],
    data () {
      return {
        search_api: 'http://23.236.57.78:8080/v1/search/',
        selected_subject: '',
        selected_number: '',
        selected_term: '',
        selected_domain: '',
        terms: [],
        learning_domains: [
          {'value':'arts-and-literature', 'name':'Arts and Literature'},
          {'value':'self-society-and-the-modern-world', 'name':'Self Society and the Modern World'},
          {'value':'scientific-inquiry', 'name':'Scientific Inquiry'},
          {'value':'philosophical-inquiry', 'name':'Philosophical Inquiry'},
          {'value':'understanding-the-past', 'name':'Understanding the Past'},
          {'value':'religious-dimensions', 'name':'Religious Dimensions'}
        ],
        subjects: [],
        professor: {}
      }
    },
    created() {
      var _this = this;
      $.get(this.search_api + 'all_terms', function(terms) {
        _this.terms = terms.data.results;
        if (_this.not_null(_this.term)) {
          _this.selected_term = _this.term;
          $.get(_this.search_api + 'all_subjects/' + _this.selected_term, function(subjects) {
            _this.subjects = subjects.data.results;
            _this.selected_subject = _this.subject;
            _this.selected_number = _this.number;
            _this.selected_domain = _this.domain;
          });
        }
      });

      $.get(this.search_api + 'by_professor_id/' + this.pid, function(professor) {
        console.log(professor.data.results)
        _this.professor = professor.data.results;
      });

    },
    watch: {
      selected_term: function() {
        if(!this.not_null(this.selected_term)) return;
        var _this = this;
        $.get(this.search_api + 'all_subjects/' + this.selected_term, function(subjects) {
          _this.subjects = subjects.data.results;
        });
      }
    },
    methods: {
      not_null: function(val) {
        if (val != '' && val != undefined && val != null) 
          return true;
        return false;
      },
      search: function() {
        this.$router.push({
          path: '/search', 
          query: { 
            subject: this.selected_subject, 
            term: this.selected_term, 
            number: this.selected_number,
            domain: this.selected_domain
          }
        })
      }
    }
  }
</script>

<style scoped>
  h1 {
    font-size: 20px
  }
  .header {
    font-size: 40px;
  }
</style>