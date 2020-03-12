var dataUrl  = "https://lab.ahusmart.com/nCoV/";
var dataUrlBackup  = "https://lab.ahusmart.com/nCoV/";

function toPercent(point){
    var str=Number(point*100).toFixed(2);
    str+="%";
    return str;
}

var initTrendChart = function () {
    var orderTraceContainer = echarts.init(document.getElementById('trend-chart'));
    orderTraceContainer.showLoading({
        text: '加载中...请稍后',
        effect: 'whirling'
    }
    );
    $.ajax({
        url: dataUrl + 'api/overall?latest=0',
        type: 'get',
        success: function (res) {
            if (res.success === true) {
                var chartData = res.results;
                var date = [];
                var dataNCoV = [];
                var confirmedNCoV = [];
                var suspectedNCoV = [];
                var curedNCoV = [];
                var deadNCoV = [];
                
                for (var i in chartData) {
                    var dataTime = new Date(chartData[i].updateTime);
                    var showTime = [dataTime.getFullYear(), dataTime.getMonth() + 1, ("0" + dataTime.getDate()).slice(-2)].join('/');
                    var confirmedCount = chartData[i].confirmedCount ? chartData[i].confirmedCount : chartData[i].confirmed;
                    var suspectedCount = chartData[i].suspectedCount ? chartData[i].suspectedCount : chartData[i].suspectedCount;
                    var curedCount = chartData[i].curedCount ? chartData[i].curedCount : chartData[i].curedCount;
                    var deadCount = chartData[i].deadCount ? chartData[i].deadCount : chartData[i].deadCount;

                    if (!dataNCoV[showTime] || dataNCoV[showTime]['confirm'] < confirmedCount) {
                        dataNCoV[showTime] = [];
                        dataNCoV[showTime]['confirm'] = confirmedCount;
                        dataNCoV[showTime]['suspect'] = suspectedCount;
                        dataNCoV[showTime]['cure'] = curedCount;
                        dataNCoV[showTime]['dead'] = deadCount;
                        //dataNCov[showTime]['deadRate'] = confirmedCount;
                        //dataNCoV[showTime]['cureRate'] = (curedCount/confirmedCount);
                    }

                }

                // 时间排序
                const dataNCoVOrdered = {};
                Object.keys(dataNCoV).sort((function (a, b) {
                    a = a.split('/').join('');
                    b = b.split('/').join('');
                    return a > b ? 1 : a < b ? -1 : 0;
                })).forEach(function (key) {
                    dataNCoVOrdered[key] = dataNCoV[key];
                });


                // use data
                for (var i in dataNCoVOrdered) {
                    date.push(i);
                    confirmedNCoV.push(dataNCoVOrdered[i]['confirm']);
                    suspectedNCoV.push(dataNCoVOrdered[i]['suspect']);
                    curedNCoV.push(dataNCoVOrdered[i]['cure']);
                    deadNCoV.push(dataNCoVOrdered[i]['dead']);
                }

                initDetailChart(date, confirmedNCoV, suspectedNCoV,curedNCoV,deadNCoV);
                return;
            }
            alert("获取数据失败");
        }, error: function (res) {
            if (res.state() === "rejected" && !this.url.includes(dataUrlBackup)) {
                this.url = this.url.replace(dataUrl,dataUrlBackup);
                $.ajax(this);
            }
        }
    });

    var initDetailChart = function (date, confirmedNCoV, suspectedNCoV,curedNCoV,deadNCoV) {
        

        echartsOption  = {
            backgroundColor: '#394056',
            title: {
                text: '全国累计确诊/治愈/死亡 趋势',
                textStyle: {
                    fontWeight: 'normal',
                    fontSize: 12,
                    color: '#ebffa1'
                },
                left: 'center',
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    lineStyle: {
                        color: '#57617B'
                    }
                }
            },
            legend: {
                icon: 'rect',
                itemWidth: 14,
                itemHeight: 5,
                itemGap: 1,
                data: ['确诊', '死亡', '治愈'],
                right: '2%',
                textStyle: {
                    fontSize: 12,
                    color: '#F1F1F3'
                }
            },
            grid: {
                left: '2%',
                right: '2%',
                bottom: '2%',
                containLabel: true
            },
            xAxis: [{
                type: 'category',
                boundaryGap: false,
                axisLine: {
                    lineStyle: {
                        color: '#57617B'
                    }
                },
                data: date
            }
            ],
            yAxis: [{
                type: 'value',
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#57617B'
                    }
                },
                axisLabel: {
                    margin: 4,
                    textStyle: {
                        fontSize: 8
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: '#57617B'
                    }
                }
            }],
            series: [{
                name: '确诊',
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 5,
                showSymbol: true,
                lineStyle: {
                    normal: {
                        width: 1
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(137, 189, 27, 0.3)'
                        }, {
                            offset: 0.8,
                            color: 'rgba(137, 189, 27, 0)'
                        }], false),
                        shadowColor: 'rgba(0, 0, 0, 0.1)',
                        shadowBlur: 10
                    }
                },
                itemStyle: {
                    normal: {
                        color: 'rgb(137,189,27)',
                        borderColor: 'rgba(137,189,2,0.27)',
                        borderWidth: 12

                    }
                },
                data: confirmedNCoV
            }, {
                name: '死亡',
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 5,
                showSymbol: true,
                lineStyle: {
                    normal: {
                        width: 1
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(0, 136, 212, 0.3)'
                        }, {
                            offset: 0.8,
                            color: 'rgba(0, 136, 212, 0)'
                        }], false),
                        shadowColor: 'rgba(0, 0, 0, 0.1)',
                        shadowBlur: 10
                    }
                },
                itemStyle: {
                    normal: {
                        color: 'rgb(0,136,212)',
                        borderColor: 'rgba(0,136,212,0.2)',
                        borderWidth: 12

                    }
                },
                data: deadNCoV
            }, {
                name: '治愈',
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 5,
                showSymbol: true,
                lineStyle: {
                    normal: {
                        width: 1
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(0, 136, 212, 0.3)'
                        }, {
                            offset: 0.8,
                            color: 'rgba(0, 136, 212, 0)'
                        }], false),
                        shadowColor: 'rgba(0, 0, 0, 0.1)',
                        shadowBlur: 10
                    }
                },
                itemStyle: {
                    normal: {
                        color: 'rgb(177,136,212)',
                        borderColor: 'rgba(0,136,212,0.2)',
                        borderWidth: 12

                    }
                },
                data: curedNCoV
            }
            ]
        };
        
        orderTraceContainer.setOption(echartsOption);
        orderTraceContainer.hideLoading();
    }
};
var initAddChart = function () {
    var orderTraceContainer = echarts.init(document.getElementById('add-chart'));
        orderTraceContainer.showLoading({
            text: '加载中...请稍后',
            effect: 'whirling'
        });
    $.ajax({
        url: dataUrl + 'api/overall?latest=0',
        type: 'get',
        success: function (res) {
            if (res.success === true) {
                var chartData = res.results;
                var date = [];
                var dataNCoV = [];
                var confirmedNCoV = [];
                var suspectedNCoV = [];
                var curedNCoV = [];
                var deadNCoV = [];

                for (var i in chartData) {
                    var dataTime = new Date(chartData[i].updateTime);
                    var showTime = [dataTime.getFullYear(), dataTime.getMonth() + 1, ("0" + dataTime.getDate()).slice(-2)].join('/');
                    var confirmedCount = chartData[i].confirmedCount ? chartData[i].confirmedCount : chartData[i].confirmed;
                    var suspectedCount = chartData[i].suspectedCount ? chartData[i].suspectedCount : chartData[i].suspectedCount;
                    var curedCount = chartData[i].curedCount ? chartData[i].curedCount : chartData[i].curedCount;
                    var deadCount = chartData[i].deadCount ? chartData[i].deadCount : chartData[i].deadCount;

                    if (!dataNCoV[showTime] || dataNCoV[showTime]['confirm'] < confirmedCount) {
                        dataNCoV[showTime] = [];
                        dataNCoV[showTime]['confirm'] = confirmedCount;
                        dataNCoV[showTime]['suspect'] = suspectedCount;
                        dataNCoV[showTime]['cure'] = curedCount;
                        dataNCoV[showTime]['dead'] = deadCount;
                    }

                }

                // 时间排序
                const dataNCoVOrdered = {};
                Object.keys(dataNCoV).sort((function (a, b) {
                    a = a.split('/').join('');
                    b = b.split('/').join('');
                    return a > b ? 1 : a < b ? -1 : 0;
                })).forEach(function (key) {
                    dataNCoVOrdered[key] = dataNCoV[key];
                });


                // use data
                for (var i in dataNCoVOrdered) {

                    var t = new Date(i);
                    t.setDate(t.getDate() - 1);
                    // var dataTime = new Date(chartData[i].updateTime);
                    var yesterday = [t.getFullYear(), t.getMonth() + 1, t.getDate()].join('/');
                    if (!dataNCoVOrdered[yesterday]) {
                        continue;
                    }

                    date.push(i);
                    confirmedNCoV.push(dataNCoVOrdered[i]['confirm'] - dataNCoVOrdered[yesterday]['confirm']);
                    suspectedNCoV.push(dataNCoVOrdered[i]['suspect'] - dataNCoVOrdered[yesterday]['suspect']);
                    curedNCoV.push(dataNCoVOrdered[i]['cure'] - dataNCoVOrdered[yesterday]['cure']);
                    deadNCoV.push(dataNCoVOrdered[i]['dead'] - dataNCoVOrdered[yesterday]['dead']);
                }

                initDetailChart(date, confirmedNCoV, suspectedNCoV,curedNCoV,deadNCoV);
                return;
            }
            alert("获取数据失败");
        }, error: function (res) {
            if (res.state() === "rejected" && !this.url.includes(dataUrlBackup)) {
                this.url = this.url.replace(dataUrl,dataUrlBackup);
                $.ajax(this);
            }
        }
    });

    var initDetailChart = function (date, confirmedNCoV, suspectedNCoV,curedNCoV,deadNCoV) {
        


        echartsOption  = {
            backgroundColor: '#394056',
            title: {
                text: '全国新增确诊/治愈/死亡 趋势',
                textStyle: {
                    fontWeight: 'normal',
                    fontSize: 12,
                    color: '#ebffa1'
                },
                left: 'center',
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    lineStyle: {
                        color: '#57617B'
                    }
                }
            },
            legend: {
                icon: 'rect',
                itemWidth: 14,
                itemHeight: 5,
                itemGap: 1,
                data: ['新增确诊', '新增死亡', '新增治愈'],
                right: '2%',
                textStyle: {
                    fontSize: 12,
                    color: '#F1F1F3'
                }
            },
            grid: {
                left: '2%',
                right: '2%',
                bottom: '2%',
                containLabel: true
            },
            xAxis: [{
                type: 'category',
                boundaryGap: false,
                axisLine: {
                    lineStyle: {
                        color: '#57617B'
                    }
                },
                data: date
            }
            ],
            yAxis: [{
                type: 'value',
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#57617B'
                    }
                },
                axisLabel: {
                    margin: 4,
                    textStyle: {
                        fontSize: 8
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: '#57617B'
                    }
                }
            }],
            series: [{
                name: '新增确诊',
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 5,
                showSymbol: true,
                lineStyle: {
                    normal: {
                        width: 1
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(137, 189, 27, 0.3)'
                        }, {
                            offset: 0.8,
                            color: 'rgba(137, 189, 27, 0)'
                        }], false),
                        shadowColor: 'rgba(0, 0, 0, 0.1)',
                        shadowBlur: 10
                    }
                },
                itemStyle: {
                    normal: {
                        color: 'rgb(137,189,27)',
                        borderColor: 'rgba(137,189,2,0.27)',
                        borderWidth: 12

                    }
                },
                data: confirmedNCoV
            }, {
                name: '新增死亡',
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 5,
                showSymbol: true,
                lineStyle: {
                    normal: {
                        width: 1
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(0, 136, 212, 0.3)'
                        }, {
                            offset: 0.8,
                            color: 'rgba(0, 136, 212, 0)'
                        }], false),
                        shadowColor: 'rgba(0, 0, 0, 0.1)',
                        shadowBlur: 10
                    }
                },
                itemStyle: {
                    normal: {
                        color: 'rgb(0,136,212)',
                        borderColor: 'rgba(0,136,212,0.2)',
                        borderWidth: 12

                    }
                },
                data: deadNCoV
            }, {
                name: '新增治愈',
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 5,
                showSymbol: true,
                lineStyle: {
                    normal: {
                        width: 1
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(0, 136, 212, 0.3)'
                        }, {
                            offset: 0.8,
                            color: 'rgba(0, 136, 212, 0)'
                        }], false),
                        shadowColor: 'rgba(0, 0, 0, 0.1)',
                        shadowBlur: 10
                    }
                },
                itemStyle: {
                    normal: {
                        color: 'rgb(177,136,212)',
                        borderColor: 'rgba(0,136,212,0.2)',
                        borderWidth: 12

                    }
                },
                data: curedNCoV
            }
            ]
        };
        orderTraceContainer.hideLoading();
        orderTraceContainer.setOption(echartsOption);
    }
};

var initRateChart = function () {
    var orderTraceContainer = echarts.init(document.getElementById('rate-chart'));
        orderTraceContainer.showLoading({
            text: '加载中...请稍后',
            effect: 'whirling'
        });
    $.ajax({
        url: dataUrl + 'api/overall?latest=0',
        type: 'get',
        success: function (res) {
            if (res.success === true) {
                var chartData = res.results;
                var date = [];
                var dataNCoV = [];
                var confirmedNCoV = [];
                var suspectedNCoV = [];
                var curedNCoV = [];
                var deadNCoV = [];
                var deadRate = [];
                var curedRate = [];
                for (var i in chartData) {
                    var dataTime = new Date(chartData[i].updateTime);
                    var showTime = [dataTime.getFullYear(), dataTime.getMonth() + 1, ("0" + dataTime.getDate()).slice(-2)].join('/');
                    var confirmedCount = chartData[i].confirmedCount ? chartData[i].confirmedCount : chartData[i].confirmed;
                    var suspectedCount = chartData[i].suspectedCount ? chartData[i].suspectedCount : chartData[i].suspectedCount;
                    var curedCount = chartData[i].curedCount ? chartData[i].curedCount : chartData[i].curedCount;
                    var deadCount = chartData[i].deadCount ? chartData[i].deadCount : chartData[i].deadCount;

                    if (!dataNCoV[showTime] || dataNCoV[showTime]['confirm'] < confirmedCount) {
                        dataNCoV[showTime] = [];
                        dataNCoV[showTime]['confirm'] = confirmedCount;
                        dataNCoV[showTime]['suspect'] = suspectedCount;
                        dataNCoV[showTime]['cure'] = curedCount;
                        dataNCoV[showTime]['dead'] = deadCount;
                        dataNCoV[showTime]['deadRate'] = deadCount/confirmedCount;
                        dataNCoV[showTime]['cureRate'] = curedCount/confirmedCount;
                    }

                }

                // 时间排序
                const dataNCoVOrdered = {};
                Object.keys(dataNCoV).sort((function (a, b) {
                    a = a.split('/').join('');
                    b = b.split('/').join('');
                    return a > b ? 1 : a < b ? -1 : 0;
                })).forEach(function (key) {
                    dataNCoVOrdered[key] = dataNCoV[key];
                });


                // use data
                for (var i in dataNCoVOrdered) {

                    var t = new Date(i);
                    t.setDate(t.getDate() - 1);
                    // var dataTime = new Date(chartData[i].updateTime);
                    var yesterday = [t.getFullYear(), t.getMonth() + 1, t.getDate()].join('/');
                    if (!dataNCoVOrdered[yesterday]) {
                        continue;
                    }

                    date.push(i);
                    confirmedNCoV.push(dataNCoVOrdered[i]['confirm'] - dataNCoVOrdered[yesterday]['confirm']);
                    suspectedNCoV.push(dataNCoVOrdered[i]['suspect'] - dataNCoVOrdered[yesterday]['suspect']);
                    curedNCoV.push(dataNCoVOrdered[i]['cure'] - dataNCoVOrdered[yesterday]['cure']);
                    deadNCoV.push(dataNCoVOrdered[i]['dead'] - dataNCoVOrdered[yesterday]['dead']);
                    deadRate.push(dataNCoVOrdered[i]['dead']/dataNCoVOrdered[i]['confirm']*100);
                    curedRate.push(dataNCoVOrdered[i]['cure']/dataNCoVOrdered[i]['confirm']*100);
                }

                initDetailChart(date, deadRate, curedRate);
                return;
            }
            alert("获取数据失败");
        }, error: function (res) {
            if (res.state() === "rejected" && !this.url.includes(dataUrlBackup)) {
                this.url = this.url.replace(dataUrl,dataUrlBackup);
                $.ajax(this);
            }
        }
    });

    var initDetailChart = function (date, deadRate, curedRate) {
        


        echartsOption  = {
            backgroundColor: '#394056',
            title: {
                text: '全国死亡率/治愈率 趋势',
                textStyle: {
                    fontWeight: 'normal',
                    fontSize: 12,
                    color: '#ebffa1'
                },
                left: 'center',
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    lineStyle: {
                        color: '#57617B'
                    }
                },
                formatter: '{b0}<br />{a0}:{c0}%<br />{a1}:{c1}%',
            },
            legend: {
                icon: 'rect',
                itemWidth: 14,
                itemHeight: 5,
                itemGap: 1,
                data: ['死亡率', '治愈率'],
                right: '2%',
                textStyle: {
                    fontSize: 12,
                    color: '#F1F1F3'
                }
            },
            grid: {
                left: '2%',
                right: '2%',
                bottom: '2%',
                containLabel: true
            },
            xAxis: [{
                type: 'category',
                boundaryGap: false,
                axisLine: {
                    lineStyle: {
                        color: '#57617B'
                    }
                },
                data: date
            }
            ],
            yAxis: [{
                type: 'value',
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#57617B'
                    }
                },
                axisLabel: {
                    margin: 4,
                    textStyle: {
                        fontSize: 8
                    },
                    formatter: '{value} %'  
                },
                splitLine: {
                    lineStyle: {
                        color: '#57617B'
                    }
                }
            }],
            series: [{
                name: '死亡率',
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 5,
                showSymbol: true,
                lineStyle: {
                    normal: {
                        width: 1
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(137, 189, 27, 0.3)'
                        }, {
                            offset: 0.8,
                            color: 'rgba(137, 189, 27, 0)'
                        }], false),
                        shadowColor: 'rgba(0, 0, 0, 0.1)',
                        shadowBlur: 10
                    }
                },
                itemStyle: {
                    normal: {
                        color: 'rgb(137,189,27)',
                        borderColor: 'rgba(137,189,2,0.27)',
                        borderWidth: 12,    
                    
                    }
                },
                data: deadRate,
            }, {
                name: '治愈率',
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 5,
                showSymbol: true,
                lineStyle: {
                    normal: {
                        width: 1
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(0, 136, 212, 0.3)'
                        }, {
                            offset: 0.8,
                            color: 'rgba(0, 136, 212, 0)'
                        }], false),
                        shadowColor: 'rgba(0, 0, 0, 0.1)',
                        shadowBlur: 10
                    }
                },
                itemStyle: {
                    normal: {
                        color: 'rgb(0,136,212)',
                        borderColor: 'rgba(0,136,212,0.2)',
                        borderWidth: 12

                    }
                },
                data: curedRate,
            },
            ]
        };
        orderTraceContainer.hideLoading();
        orderTraceContainer.setOption(echartsOption);
    }
};

var initCoreData = function (province) {

    $.ajax({
        url: dataUrl + 'api/overall?latest=1',
        type: 'get',
        success: function (res) {
            if (res.success === true) {
                var data = res.results[0];
                var html = 
                    '<div class="confirmData">'+data.confirmedCount+'</div>' +
                    '<div class="totalConfirmData">'+data.curedCount+'</div>'+
                    '<div class="totalCuredData">'+data.curedCount+'</div>' +
                    '<div class="totalDeadData">'+data.deadCount+'</div>';
                $(".core-data").html(html);

                return;
            }
            alert("获取数据失败");

        },
        error: function (res) {
            if (res.state() === "rejected" && !this.url.includes(dataUrlBackup)) {
                this.url = this.url.replace(dataUrl, dataUrlBackup);
                $.ajax(this);
            }
        }
    })

};


