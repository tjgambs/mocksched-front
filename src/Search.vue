<template>
  <div>
    <div align="center">
      <div class="header">
        <a href="/">Mocksched</a>
      </div>
      <div class="subheader">DePaul University</div>
      <div class="search-box">   
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
        <input v-bind:value="selected_number" v-on:input="selected_number = $event.target.value"/>
      </div>
    </div>

    <div class="columns">
      <div class="column"></div>
      <div class="column is-three-quarters">
        <span v-for="r in results">
          <div class="result">
            <router-link :to="'course?term=' + selected_term + '&subject=' + r.subject + '&number=' + r.catalog_nbr">
              <div class="result-header">{{ r.subject + ' ' + r.catalog_nbr + ' - ' + r.title}}</div>
            </router-link>
            <div>{{ r.description + (r.prerequisites ? (' Prerequisites: ' + r.prerequisites) : '')}}</div>
          </div>
        </span>
      </div>
      <div class="column"></div>
    </div>

  </div>
</template>

<script>

  export default {
    props: ['term','subject','number'],
    data () {
      return {
        search_api: 'http://23.236.57.78:8080/v1/search/',
        selected_term: '',
        terms: [],
        selected_subject: '',
        subjects: [],
        selected_number: '',
        results: []
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
          });
        }
      });
    },
    watch: {
      selected_term: function() {
        if(!this.not_null(this.selected_term)) return;
        var _this = this;
        $.get(this.search_api + 'all_subjects/' + this.selected_term, function(subjects) {
          _this.subjects = subjects.data.results;
        });
      },
      selected_subject: function() {
        this.get_results();
      },
      selected_number: function() {
        this.get_results();
      }
    },
    methods: {
      update_url: function () {
        this.$router.push({
          path: '/search', 
          query: { 
            subject: this.selected_subject, 
            term: this.selected_term, 
            number: this.selected_number 
          }
        })
      },
      get_results: function () {
        var _this = this;
        if(!this.not_null(this.selected_term)) return;
        if(this.not_null(this.selected_number) && this.not_null(this.selected_subject)) {
          $.get(this.search_api + 'by_subject_number/' + this.selected_subject + '/' + this.selected_number + '/' + this.selected_term, function(response) {
            _this.results = response.data.results;
            _this.update_url();
          });
        } else if (this.not_null(this.selected_number)) {
          $.get(this.search_api + 'by_number/' + this.selected_number + '/' + this.selected_term, function(response) {
            _this.results = response.data.results;
            _this.update_url();
          });
        } else if (this.not_null(this.selected_subject)) {
          $.get(this.search_api + 'by_subject/' + this.selected_subject + '/' + this.selected_term, function(response) {
            _this.results = response.data.results;
            _this.update_url();
          });
        }
      },
      not_null: function(val) {
        if (val != '' && val != undefined && val != null) 
          return true;
        return false;
      }
    }
  }
</script>

<style scoped>
  .result {
    padding: 10px;
    font-size: 15px;
  }
  .result-header {
    font-size: 20px;
  }
  .header {
    font-size: 40px;
  }
  .subheader {
    font-size: 20px;
  }
  .search-box {
    padding: 10px;
    margin: auto;
    width: 50%;
  }
</style>