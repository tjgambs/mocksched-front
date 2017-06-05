<template>
  <div>
    <div align="center">
      <div class="header">Mocksched</div>
    </div>
    <div align="center">
      <div class="subheader">DePaul University</div>
    </div>
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
      <input v-bind:value="number" v-on:input="number = $event.target.value"/>
      <input class="search-button" type="submit" value="SEARCH" v-on:click="search()">
    </div>
    <div class="columns">
      <div class="column"></div>
      <div class="column is-three-quarters">
        <span v-for="r in results">
          <div class="result">
            <div class="result-header">{{ r.subject + ' ' + r.catalog_nbr + ' - ' + r.title}}</div>
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
    data () {
      return {
        selected_term: '',
        terms: [],
        selected_subject: '',
        subjects: [],
        number: '',
        results: []
      }
    },
    created() {
      var _this = this;
      $.get( "http://0.0.0.0:5000/v1/search/all_terms", function(terms) {
        _this.terms = terms.data.results;
      });
    },
    watch: {
      selected_term: function() {
        var _this = this;
        $.get( "http://0.0.0.0:5000/v1/search/all_subjects/"+this.selected_term, function(subjects) {
          _this.subjects = subjects.data.results;
        });
      }
    },
    methods: {
      search () {
        var _this = this;
        if(this.selected_term == '') return;
        if(this.number != '' && this.selected_subject != '') {
          $.get( "http://0.0.0.0:5000/v1/search/by_subject_number/"+this.selected_subject+'/'+this.number+'/'+this.selected_term, function(response) {
            _this.results = response.data.results;
          });
        } else if (this.number != '') {
          $.get( "http://0.0.0.0:5000/v1/search/by_number/"+this.number+'/'+this.selected_term, function(response) {
            _this.results = response.data.results;
          });
        } else if (this.selected_subject != '') {
          $.get( "http://0.0.0.0:5000/v1/search/by_subject/"+this.selected_subject+'/'+this.selected_term, function(response) {
            _this.results = response.data.results;
          });
        }
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