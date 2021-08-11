$(function () {
    commonHeader();
    commonLeftNav();
    // commonModeFullHeader();
});

/**公共头部**/
function commonHeader() {
    let text = `<h3 class="fl left-nav-switch hand" @click="switchNav"></h3>
        <h4 class="fl ml10 font-size-18 text-white lh32">阳光校园·智慧教育</h4>
        <!--<ul class="fl ml30 header-type-switch clearfix">-->
        <!--<li v-for="item in typeList" :class="curSelect == item.id?'selected':''" @click="switchType(item)">{{item.title}}</li>-->
        <!--</ul>-->
        <div class="fl time-select-box hand ph10 pr" :class="timeRangeValue.length > 0?'date':''">
            <div class="clearfix">
                <span class="fl title">{{timeTitle}}</span>
                <i class="fr arrow"></i>
            </div>
            <ul class="time-select-list">
                <li v-for="(item,index) in timeList" :id="item.time" :class="timeType == item.time?'selected':''" @click="switchTime(item,index)">{{item.title}}</li>
                
                <el-date-picker v-model="timeRangeValue" value-format="yyyy/MM/dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" ref="timePick" class="date-picker" @change="getTime"></el-date-picker>
            </ul>
        </div>
        <h3 v-if="showFullScreen" class="fr full-screen-nav hand" @click="toFullScreen"></h3>
        <div class="fr mr15 header-search-box none">
            <input type="text" class="search-in fl" placeholder="搜索地区或学习…">
            <button type="button" class="fl search-btn"></button>
        </div>`;
    $('#header').html(text);
    new Vue({
        el: '#header',
        data() {
            return {
                timeRangeValue: [],
                curSelect: 'qqyxt',
                timeType: '7days',
                timeTitle: '近7日',
                timeList: [{
                    time: '7days',
                    title: '近7日'
                }, {
                    time: '30days',
                    title: '近30日'
                }, {
                    time: '',
                    title: '选择时间段…'
                }],
                showFullScreen: false
            }
        },
        methods: {
            switchNav() {
                $('.left-nav').toggleClass('switch');
                if (location.href.includes('dataBoardProvince')) {
                    $('.right-content').toggleClass('switch');
                }
            },
            selectTime() {
                if (this.$refs.timePick.$el) {
                    this.$refs.timePick.$el.click();
                }
            },
            getTime() {
                this.timeTitle = this.timeRangeValue[0] + '-' + this.timeRangeValue[1];
                this.timeType = this.timeRangeValue[0] + '-' + this.timeRangeValue[1];
                this.timeList[2].time = this.timeRangeValue[0] + '-' + this.timeRangeValue[1];
                this.timeList[2].title = this.timeRangeValue[0] + '-' + this.timeRangeValue[1];
                $('#dataTime').val(this.timeRangeValue[0] + '-' + this.timeRangeValue[1]);
                $("#dataTime").trigger("oninput");
            },
            switchType(item) {
                this.curSelect = item.id;
                $('#dataSystem').val(item.id);
                $("#dataSystem").trigger("oninput");
            },
            switchTime(item, index) {
                if (item.time != '') {
                    this.timeTitle = item.title;
                    this.timeType = item.time;
                    if (index != 2) {
                        this.timeRangeValue = [];
                        this.timeList[2].time = '';
                        this.timeList[2].title = '选择时间段…';
                    }
                    $('#dataTime').val(item.time);
                    $("#dataTime").trigger("oninput");
                } else {
                    this.selectTime();
                }
            },
            toFullScreen() {
                if (location.href.includes('dataBoardProvince')) {
                    let s_arr = location.search.split('&');
                    if (s_arr[0].substr(5) == 'qqyxt') {
                        window.location.href = '../page/modeFull_allData.html?sys=' + s_arr[0].substr(5);
                    } else {
                        window.location.href = '../page/modeFull_province.html?sys=' + s_arr[0].substr(5);
                    }

                } else if (location.href.includes('dataBoardCity')) {
                    if (localStorage.getItem('cityId')) {
                        window.location.href = '../page/modeFull_city.html?cityId=' + localStorage.getItem('cityId');
                    } else {
                        window.location.href = '../page/modeFull_city.html?cityId=' + JSON.parse(localStorage.getItem('userInfo')).area_info.area_id2;
                    }
                } else {
                    if (localStorage.getItem('areaId')) {
                        window.location.href = '../page/modeFull_school.html?areaId=' + localStorage.getItem('areaId');
                    } else {
                        window.location.href = '../page/modeFull_school.html?areaId=' + JSON.parse(localStorage.getItem('userInfo')).area_info.area_id3;
                    }
                }
            }
        },
        mounted() {
            if (location.href.includes('dataBoardProvince') || location.href.includes('dataBoardCity') || location.href.includes('dataBoardSchool')) {
                this.showFullScreen = true;
            }
        }
    });
}

/**公共侧导航**/
function commonLeftNav() {
    let text = `<ul class="left-nav-list">
                     <li v-for="item in navList">
                         <h3 class="title"><span>{{item.title}}</span></h3>
                         <div class="nav-sub-list">
                            <a href="javascript:;" v-for="(items,index) in item.subNav" :class="items.pageId == curId?'selected':''" @click="toPage(items.href,items.pageId)">
                                <span class="nav-icon" :class="'icon-'+ items.pageId"></span>
                                <span class="d-in-block v-mid">{{items.title}}</span>
                            </a>
                         </div>
                     </li>
             </ul>`;
    $('#leftNav').html(text);
    var vm = new Vue({
        el: '#leftNav',
        data() {
            return {
                navList: [],
                curId: 1,
                userInfo: {}
            }
        },
        methods: {
            toggleSubNav(index) {
                if (this.navList[index].selected) {
                    this.navList[index].selected = false;
                } else {
                    this.navList[index].selected = true;
                }
            },
            toPage(href, id) {
                if (href.includes('?')) {
                    window.location.href = href + '&pageId=' + id;
                } else {
                    window.location.href = href + '?pageId=' + id;
                }

            }
        },
        mounted() {
            if (localStorage.getItem('userInfo')) {
                this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
                if(this.userInfo.area_info.area_id1 == 24) {
                    switch (this.userInfo.user_role_id) {
                        case '3':
                        case '63':
                            this.navList = [{
                                title: '数据汇总',
                                subNav: [{
                                    title: '设备数据',
                                    pageId: 1,
                                    href: '../page/deviceProvince.html'
                                }, {
                                    title: '数据看板',
                                    pageId: 2,
                                    href: '../page/dataBoardProvince.html?sys=qqyxt'
                                }]
                            }, {
                                title: '同步课堂',
                                subNav: [{
                                    title: '数据看板',
                                    pageId: 3,
                                    href: '../page/dataBoardProvince.html?sys=tbkt'
                                }, {
                                    title: '学校数据',
                                    pageId: 4,
                                    href: '../page/dataBoardSchool.html'
                                }, {
                                    title: '开课数据',
                                    pageId: 5,
                                    href: '../page/courseData.html'
                                }, {
                                    title: '开课排行',
                                    pageId: 6,
                                    href: '../page/sxkk.html'
                                }]
                            }, {
                                title: '空中课堂',
                                subNav: [{
                                    title: '名校课堂数据',
                                    pageId: 7,
                                    href: '../page/dataKanban.html'
                                }]
                            }, {
                                title: '教研师训',
                                subNav: [{
                                    title: '名师课堂数据',
                                    pageId: 8,
                                    href: '../page/mskt.html'
                                }]
                            }];
                            break;
                        case '66':
                        case '67':
                        case '68':
                            this.navList = [{
                                title: '数据汇总',
                                subNav: [{
                                    title: '设备数据',
                                    pageId: 1,
                                    href: '../page/deviceCity.html'
                                }, {
                                    title: '数据看板',
                                    pageId: 2,
                                    href: '../page/dataBoardCity.html?sys=qqyxt'
                                }]
                            }, {
                                title: '同步课堂',
                                subNav: [{
                                    title: '数据看板',
                                    pageId: 3,
                                    href: '../page/dataBoardCity.html?sys=tbkt'
                                }, {
                                    title: '学校数据',
                                    pageId: 4,
                                    href: '../page/dataBoardSchool.html'
                                }, {
                                    title: '开课数据',
                                    pageId: 5,
                                    href: '../page/courseData.html'
                                }, {
                                    title: '开课排行',
                                    pageId: 6,
                                    href: '../page/sxkk.html'
                                }]
                            }, {
                                title: '空中课堂',
                                subNav: [{
                                    title: '名校课堂数据',
                                    pageId: 7,
                                    href: '../page/dataKanban.html'
                                }]
                            }, {
                                title: '教研师训',
                                subNav: [{
                                    title: '名师课堂数据',
                                    pageId: 8,
                                    href: '../page/mskt.html'
                                }]
                            }];
                            break;
                        case '69':
                        case '70':
                        case '71':
                        case '72':
                        case '73':
                        case '74':
                        case '75':
                        case '101':
                            this.navList = [{
                                title: '同步课堂',
                                subNav: [{
                                    title: '学校数据',
                                    pageId: 4,
                                    href: '../page/dataBoardSchool.html'
                                }, {
                                    title: '开课数据',
                                    pageId: 5,
                                    href: '../page/courseData.html'
                                }, {
                                    title: '开课排行',
                                    pageId: 6,
                                    href: '../page/sxkk.html'
                                }]
                            }, {
                                title: '空中课堂',
                                subNav: [{
                                    title: '名校课堂数据',
                                    pageId: 7,
                                    href: '../page/dataKanban.html'
                                }]
                            }, {
                                title: '教研师训',
                                subNav: [{
                                    title: '名师课堂数据',
                                    pageId: 8,
                                    href: '../page/mskt.html'
                                }]
                            }];
                            this.curId = 4;
                            break;
                    }
                } else {
                    switch (this.userInfo.user_role_id) {
                        case '3':
                        case '63':
                            this.navList = [{
                                title: '同步课堂',
                                subNav: [{
                                    title: '学校数据',
                                    pageId: 4,
                                    href: '../page/dataBoardSchool.html'
                                }, {
                                    title: '开课数据',
                                    pageId: 5,
                                    href: '../page/courseData.html'
                                }, {
                                    title: '开课排行',
                                    pageId: 6,
                                    href: '../page/sxkk.html'
                                }]
                            }, {
                                title: '空中课堂',
                                subNav: [{
                                    title: '名校课堂数据',
                                    pageId: 7,
                                    href: '../page/dataKanban.html'
                                }]
                            }, {
                                title: '教研师训',
                                subNav: [{
                                    title: '名师课堂数据',
                                    pageId: 8,
                                    href: '../page/mskt.html'
                                }]
                            }];
                            break;
                        case '66':
                        case '67':
                        case '68':
                            this.navList = [{
                                title: '同步课堂',
                                subNav: [{
                                    title: '学校数据',
                                    pageId: 4,
                                    href: '../page/dataBoardSchool.html'
                                }, {
                                    title: '开课数据',
                                    pageId: 5,
                                    href: '../page/courseData.html'
                                }, {
                                    title: '开课排行',
                                    pageId: 6,
                                    href: '../page/sxkk.html'
                                }]
                            }, {
                                title: '空中课堂',
                                subNav: [{
                                    title: '名校课堂数据',
                                    pageId: 7,
                                    href: '../page/dataKanban.html'
                                }]
                            }, {
                                title: '教研师训',
                                subNav: [{
                                    title: '名师课堂数据',
                                    pageId: 8,
                                    href: '../page/mskt.html'
                                }]
                            }];
                            break;
                        case '69':
                        case '70':
                        case '71':
                        case '72':
                        case '73':
                        case '74':
                        case '75':
                        case '101':
                            this.navList = [{
                                title: '同步课堂',
                                subNav: [{
                                    title: '学校数据',
                                    pageId: 4,
                                    href: '../page/dataBoardSchool.html'
                                }, {
                                    title: '开课数据',
                                    pageId: 5,
                                    href: '../page/courseData.html'
                                }, {
                                    title: '开课排行',
                                    pageId: 6,
                                    href: '../page/sxkk.html'
                                }]
                            }, {
                                title: '空中课堂',
                                subNav: [{
                                    title: '名校课堂数据',
                                    pageId: 7,
                                    href: '../page/dataKanban.html'
                                }]
                            }, {
                                title: '教研师训',
                                subNav: [{
                                    title: '名师课堂数据',
                                    pageId: 8,
                                    href: '../page/mskt.html'
                                }]
                            }];
                            this.curId = 4;
                            break;
                    }
                }

            }
            if (location.search.includes('pageId')) {
                let searchArr = location.search.split('&');
                if (searchArr[0].includes('pageId')) {
                    this.curId = searchArr[0].substr(8);
                } else {
                    this.curId = searchArr[1].substr(7);
                }
            }
        }
    })
}

/*大屏公共头部 **/
function commonModeFullHeader() {
    let tempText = `
      <div class="modeFullHeader_inside">
      <h3>{{bigTitle}}</h3>
      <div class="imageWatch"><img src="../src/images/decoration_1.png"></div>
      <div class="switchBtn">
        <ul>
          <li :class="{acriveLi : num==index}" v-for="(item,index) in tabSwitchCon" @click="tabSwitch(index)">
            <span>{{item}}</span>
          </li>
          <div class="bott"></div>
        </ul>
      </div>
      <div class="imageWatch"><img src="../src/images/decoration_1.png"></div>
      <div class="selectDrop">
        <div class="commonTitle_top"></div>
        <div class="selectDrop_main">
          <div class="selectDrop_mainIn">
            <el-select v-model="value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="commonTitle_bottom"></div>
      </div>
      <div class="imageWatch2"><img src="../src/images/decoration_2.png"></div>
      <div class="searchBox">
        <div class="commonTitle_top"></div>
        <div class="searchBox_main">
          <div class="searchBox_mainIn">
            <input type="input" placeholder="搜索地区或学习…">
            <img src="../src/images/search_icon.png" alt="" @click="serchBtn">
          </div>
        </div>
        <div class="commonTitle_bottom"></div>
        
      </div>
      <div class="ZoomOutBtn">
        <div class="commonTitle_top"></div>
        <div class="ZoomOut_main">
          <div class="ZoomOut_mainIn">
            <img src="../src/images/zoomOut_icon.png" alt="">
          </div>
        </div>
        <div class="commonTitle_bottom"></div>
      </div>
    </div>
  `;
    $('#modeFullHeader').html(tempText);
    new Vue({
        el: '#modeFullHeader',
        data() {
            return {
                bigTitle: "阳光校园·智慧教育",
                tabSwitchCon: ['全部', '同步课堂', '空中课堂', '教研师训'],
                num: 0,
                options: [{
                    value: '选项1',
                    label: '黄金糕'
                }, {
                    value: '选项2',
                    label: '双皮奶'
                }, {
                    value: '选项3',
                    label: '蚵仔煎'
                }, {
                    value: '选项4',
                    label: '龙须面'
                }, {
                    value: '选项5',
                    label: '北京烤鸭'
                }],
                value: '',
            }
        },
        methods: {
            serchBtn() {
                console.log('点击搜索按钮')
            },
            tabSwitch(index) {
                this.num = index;
            }
        },
        mounted() {
            self = this
            window.serchBtn = self.serchBtn;
        }
    })

}