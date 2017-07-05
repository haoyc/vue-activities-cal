import Vue from 'vue'

import jQuery from 'jquery';

import moment from 'moment';
import datepicker from 'bootstrap-datepicker';
import _ from 'lodash';
import faker from 'faker';

require('./main.scss');





var Activities = {};

Activities.app = (function ($) {

  var todayDate = moment().format('M/D/YYYY'),
      defaultEaseMode = 'easeInOutQuint',
      defaultEaseTime = 0.5,
      defaultEaseTimeMS = defaultEaseTime*1000;

  return {

    getFakerData: function() {

      var activitiesData = [];

      function timePad(num, size) {
        var s = num + '';
        while (s.length < size) s = "0" + s;
        return s;
      }

      var activityDate = moment().subtract(15,'days').format('M/D/YYYY'),
          k = 0;
          // endDate = moment().add(30,'days').calendar();

      // 30 days
      for(var j=0;j<=30;j++) {

        var activityDate = moment(activityDate,'M/D/YYYY').add(1,'days').format('M/D/YYYY');

        // console.log(j + ' of 30');

        // 8 per day
        for(var i=0;i<=8;i++) {

          // console.log(i + ' of 8');

          // console.log(activityDate);
          // console.log(i + ' : ' + j + ' : ' + h);

          // activity times
          var timeHour = faker.random.number({
                'min':1,
                'max':23
              }),
              timeMin = faker.random.number({
                'min':0,
                'max':59
              }),
              startseconds = parseFloat((timeHour*60) + timeMin),
              timeAmPm = 'am',
              timeOfDay = 'morning';

          var timeHour12 = timeHour;

          // military time to 12 hour
          if(timeHour>12) {
            timeHour12 = timeHour - 12;
            timeAmPm = 'pm';
            timeOfDay = 'afternoon';
          }

          if(timeHour>17) {
            timeOfDay = 'evening';
          }

          // leading zeros on minutes
          timeMin = timePad(timeMin,2);

          var price = ['','','','','','','','','','','','','','19.99','29.99','39.99'],
              limit = ['','','','','','','','','','','','','','4','8','24'],
              levels = ['','I','II','III','I/II','II/III'],
              icon1 = ['','','','','','','','','F'],
              icon2 = ['','','','','','','','C','CME'],
              duration = ['','','','30','60','90','120'];

          activitiesData[k] = [];
          activitiesData[k]['id'] = faker.random.uuid();
          activitiesData[k]['destination'] = faker.address.country();
          activitiesData[k]['name'] = faker.lorem.words();
          activitiesData[k]['description'] = faker.lorem.sentence();
          activitiesData[k]['details'] = 'Sign up: Call Ext. 4338';
          activitiesData[k]['price'] = price[Math.floor(Math.random() * price.length)];
          activitiesData[k]['location'] = faker.address.city();
          activitiesData[k]['date'] = activityDate;
          activitiesData[k]['starttime'] = timeHour12 + ':' + timeMin + ' ' + timeAmPm;
          activitiesData[k]['startseconds'] = startseconds;
          activitiesData[k]['timeofday'] = timeOfDay; // TO DO - remove
          activitiesData[k]['duration'] = duration[Math.floor(Math.random() * duration.length)];
          activitiesData[k]['limit'] = limit[Math.floor(Math.random() * limit.length)];
          activitiesData[k]['level'] = levels[Math.floor(Math.random() * levels.length)];
          activitiesData[k]['icon1'] = icon1[Math.floor(Math.random() * icon1.length)];
          activitiesData[k]['icon2'] = icon2[Math.floor(Math.random() * icon2.length)];

          k++;

        }

      }

      return activitiesData;

    },

    dailySchedule: function() {

      // load sample (faker) data if none provided globally
      if(!window.activitiesData) {
        var activitiesData = Activities.app.getFakerData(activitiesData);
      }

      // if we have some activities data
      if (activitiesData) {

        Vue.directive('datechange', {
            // update bindings on insert of new dom elements
            inserted: function() {
                // Activities.app.wishlist();
                // Activities.app.initTooltips();
            },
            componentUpdated: function() {
                // Activities.app.wishlist();
                // Activities.app.initTooltips();
            }
        });

        new Vue({
            el: '#activities',
            data: {
                today: todayDate,
                items: activitiesData
            },
            computed: {
                // get todays items intially
                todayItems: function() {

                    var whichDay = this.today;

                    // filter items by day
                    return _.orderBy(this.items.filter(function(item, i) {
                        if (item.date === whichDay) {
                            return item;
                        }
                    }), 'startseconds', 'asc');

                },
                todayFormatted: function() {

                    // format today date
                    return moment(this.today, 'M/D/YYYY').format('dddd, MMMM Do YYYY');
                }
            },
            methods: {
                // add one day
                nextDay: function(e) {
                    // scroll page
                    Activities.app.scrolltoElement($('#activities'), 200);

                    if (this.today) {
                        todayDate = moment(this.today, 'M/D/YYYY').add(1, 'd').format('M/D/YYYY');
                    } else {
                        todayDate = moment(todayDate, 'M/D/YYYY').add(1, 'd').format('M/D/YYYY');
                    }
                    this.today = todayDate;
                },
                // go back one day
                prevDay: function(e) {
                    // scroll page
                    Activities.app.scrolltoElement($('#activities'), 200);

                    if (this.today) {
                        todayDate = moment(this.today, 'M/D/YYYY').subtract(1, 'd').format('M/D/YYYY');
                    } else {
                        todayDate = moment(todayDate, 'M/D/YYYY').subtract(1, 'd').format('M/D/YYYY');
                    }
                    this.today = todayDate;
                },
                // add/remove from wishlist
                wishlistToggle: function(e) {
                  // Activities.app.wishListHeartClick($(e.currentTarget), $oldWishlist);
                }
            },
            created: function() {

                var self = this,
                    activeDates = _.map(activitiesData, _.property('date')),
                    $activitiesPicker = $('#activities-picker');

                // init date picker
                $activitiesPicker.datepicker({
                    todayHighlight: true,
                    beforeShowDay: function(date) {
                      var d = date;
                      var curr_date = d.getDate();
                      var curr_month = d.getMonth() + 1; //Months are zero based
                      var curr_year = d.getFullYear();
                      var formattedDate = curr_month + "/" + curr_date + "/" + curr_year;

                      // set active classes on dates with activites
                      if ($.inArray(formattedDate, activeDates) !== -1) {
                          return {
                              classes: 'has-activity'
                          };
                      }
                    }
                }).on('changeDate', function(e) {

                    var curDate = e.format('m/d/yyyy');

                    // update data
                    $('#activities-picker-input').val(curDate);
                    self.today = curDate;

                    // close calendar
                    $('#activities-picker-btn').trigger('click');

                    // scroll page
                    Activities.app.scrolltoElement($('#activities'), 200);
                });

                // show/hide date picker
                $('#activities-picker-btn').on('click', function() {
                    $activitiesPicker.toggle('open');
                });

            }

        });


      } else {
          // no activities data - hide activities?
          $('.events-picker-button-wrap, #activities').hide();
      }

    },

    initTooltips: function(){
      // $('.tooltip').not('.tooltipstered').tooltipster();
    },

    scrolltoElement: function($selector,$offset) {

      if($selector) {

          setTimeout(function(){

            // default is header height
            if(!$offset) {
              $offset = $('.site-header').height();
            }

            $offset = $offset - 1; // 1 px offset

            $('html, body').animate({scrollTop:$($selector).offset().top-$offset}, defaultEaseTimeMS, defaultEaseMode);

          },500);
      }
    },

    init: function() {
      Activities.app.dailySchedule();
    }

  }

})(jQuery);


Activities.app.init();

