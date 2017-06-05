<template>
  <div>
  	<div class="columns">
      <div class="column"></div>
      <div class="column is-three-quarters">
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
	        		<td>{{ section.overall_score }}</td>
	        		<td>{{ clean_status(section.enrl_stat) }}</td>
	        		<td>{{ section.units_acad_prog }}</td>
	        		<td>{{ section.topic }}</td>
	        		<td>{{ section.first_name + ' ' + section.last_name }}</td>
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
      <div class="column"></div>
    </div>
  </div>
</template>

<script>

  export default {
    data () {
      return {
        subject:'CSC',
        number:'300',
        title:'Data Structures In Java I',
        description: 'This is the first course in a two-course sequence on data structures using Java.  The course introduces basic Java programming, reviews recursion, introduces asymptotic notations, and focuses mainly on linear data structures including arrays, linked lists and their variants, stacks and queues, and data structures supporting disjoint-set operations.  The implementation of the basic operations on each data structure are discussed and analyzed in terms of their efficiency. The applications covered highlight and exploit the unique characteristics of the data structures, and emphasize problem solving and recursive thinking.  Prerequisite(s): CSC 242 or CSC 243',
        prerequisites: 'CSC 242 or CSC 243 is the prerequisite for this class.',
        term:'0995',
        headers: ['Rating','Status','Credits','Topic','Instructor','Start','End','Section','Number','Location','Days'],
        sections: []
      }
    },
    created() {
      var _this = this;
      $.get( "http://0.0.0.0:5000/v1/search/by_class/"+this.subject+"/"+this.number+"/"+this.term, function(sections) {
        _this.sections = sections.data.results;
      });
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
      }
    }
  }
</script>

<style scoped>
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