<template>
  <div v-if="courseinfo_complete && table_complete">
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
            <input placeholder="Course Number" v-bind:value="selected_number" v-on:keyup.enter="search" v-on:input="selected_number = $event.target.value" />
            <select v-model="selected_domain" id="domains">
              <option value="">Learning Domain</option>
              <option v-for="domain in learning_domains" v-bind:value="domain.value">
                {{ domain.name }}
              </option>
            </select>
            <input class="search-button" type="submit" value="SEARCH" v-on:click="search()">
          </div>
        </div>
      </div>
      <div class="column is-1"></div>
    </div>

  	<div class="columns">
      <div class="column is-1"></div>
      <div class="column">
        <div class="header">{{subject + ' ' + number + ' - ' + title}}</div>
        <div class="subheader">{{ description + (prerequisites ? (' Prerequisites: ' + prerequisites) : '')}}</div>
          <table id="sections" class="tablesorter">
          	<thead>
          		<th v-for="head in headers">
          			{{ head }}
          		</th>
          	</thead>
          	<tbody>
  	        	<tr v-for="section in sections">
  	        		<td v-if="section.overall_score > 0">
                  <router-link :to="'professor?pid=' + section.professor_id + '&term=' + selected_term + '&subject=' + selected_subject + '&number=' + selected_number">
                    {{ section.overall_score }}
                  </router-link>
                </td>
                <td v-else>N/A</td>
  	        		<td>{{ clean_status(section.enrl_stat) }}</td>
  	        		<td>{{ section.units_acad_prog }}</td>
  	        		<td v-if="has_topic">{{ section.topic_descr }}</td>
                <td v-if="section.professor_id != undefined">
                  <router-link :to="'professor?pid=' + section.professor_id + '&term=' + selected_term + '&subject=' + selected_subject + '&number=' + selected_number">
                    {{ section.first_name + ' ' + section.last_name }}
                  </router-link>
                </td>
                <td v-else>
                  {{ section.first_name + ' ' + section.last_name }}
                </td>
  	        		<td>{{ clean_time(section.meeting_time_start) || 'Online' }}</td>
  	        		<td>{{ clean_time(section.meeting_time_end) || 'Online' }}</td>
  	        		<td>{{ section.class_section }}</td>
  	        		<td>{{ section.class_nbr }}</td>
  	        		<td>{{ section.location_descr }}</td>
  	        		<td>{{ clean_days(section) }}</td>
  	        	</tr>
          	</tbody>
          </table>
      </div>
      <div class="column is-1"></div>
    </div>
  </div>
</template>

<script>

  export default {
    props: ['term','subject','number','domain'],
    data () {
      return {
        search_api: 'http://localhost:5000/v1/search/',
        selected_subject: '',
        selected_number: '',
        selected_domain: '',
        title: null,
        description: null,
        prerequisites: null,
        selected_term: '',
        sections: [],
        terms: [],
        courseinfo_complete: false,
        table_complete: false,
        learning_domains: [
          {'value':'arts-and-literature', 'name':'Arts and Literature'},
          {'value':'self-society-and-the-modern-world', 'name':'Self Society and the Modern World'},
          {'value':'scientific-inquiry', 'name':'Scientific Inquiry'},
          {'value':'philosophical-inquiry', 'name':'Philosophical Inquiry'},
          {'value':'understanding-the-past', 'name':'Understanding the Past'},
          {'value':'religious-dimensions', 'name':'Religious Dimensions'}
        ],
        subjects: [],
        headers: [],
        has_topic: false
      }
    },
    created() {
      var _this = this;
      $.get(this.search_api + 'all_terms', function(terms) {
        _this.terms = terms.data.results;
        if (_this.not_null(_this.term)) {
          _this.selected_term = _this.term;
          $.get(_this.search_api + 'all_subjects/' + _this.selected_term, function(subjects) {
            if (_this.subjects != undefined) {
              _this.subjects = subjects.data.results;
            } if (_this.selected_subject != undefined) {
              _this.selected_subject = _this.subject;
            } if (_this.number != undefined) {
              _this.selected_number = _this.number;
            } if (_this.domain != undefined) {
              _this.selected_domain = _this.domain;
            }
          });
        }
      });
      $.get(this.search_api + 'by_class/' + this.subject + '/' + this.number + '/' + this.term, function(sections) {
        _this.sections = sections.data.results;
        if(!_this.not_null(_this.sections[0].topic_descr)) {
          _this.headers = ['RMP Rating','Status','Credits','Instructor','Start','End','Section','Number','Location','Days'];
          _this.has_topic = false;
        }
        else {
          _this.headers = ['RMP Rating','Status','Credits','Topic','Instructor','Start','End','Section','Number','Location','Days'];
          _this.has_topic = true;
        }
        _this.table_complete = true;
      });
      $.get(this.search_api + 'by_subject_number/' + this.subject + '/' + this.number + '/' + this.term, function(course) { 
        _this.title = course.data.results[0].title;
        _this.description = course.data.results[0].description;
        _this.prerequisites = course.data.results[0].prerequisites;
        _this.courseinfo_complete = true;
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
      clean_days: function(section) {
      	var ret = '';
      	if(section.mon == 'Y') ret += 'M';
      	if(section.tues == 'Y') ret += 'Tu';
      	if(section.wed == 'Y') ret += 'W';
      	if(section.thurs == 'Y') ret += 'Th';
      	if(section.fri == 'Y') ret += 'F';
      	return ret;
      },
      clean_time: function(time) {
      	if(time == '')
      		return time;
      	return time.split(' ')[1].replace(':00','');
      },
      clean_status: function(status) {
      	if(status == 'O') return 'Open';
      	if(status == 'C') return 'Closed';
      	if(status == 'W') return 'Waitlisted';
      },
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
	.tablesorter thead tr .headerSortDown, .tablesorter thead tr .headerSortUp {
		background-color: #929292;
	}
	.tablesorter {
		border: solid #444 1px;
	 font: 300 12px 'Open Sans', sans-serif
	}
	.tablesorter td, .tablesorter th {
    border-left: 1px solid #444;
    border-top: 1px solid #444;
    padding: 10px; 
	}
	.tablesorter th {
		font: 12px 'Open Sans', sans-serif;
    background-color: #C5C5C5;  
    border-top: none;
	}
	.tablesorter td:first-child, .tablesorter th:first-child {
		border-left: none;
	}
	.header {
    font-size: 40px;
	}
	.subheader {
    font-size: 14px;
    padding-bottom: 10px;
	}
</style>