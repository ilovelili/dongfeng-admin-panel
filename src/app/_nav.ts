export const navigation = [  
  {
    name: '班级信息',
    url: '/班级信息',
    icon: 'icon-notebook'
  },
  {
    name: '园儿信息',
    url: '/园儿信息',
    icon: 'icon-people'
  },
  {
    name: '教师信息',
    url: '/教师信息',
    icon: 'icon-star'
  },
  // {
  //   name: '成长档案',
  //   url: '/theme/typography',
  //   icon: 'icon-pencil'
  // },
  {
    name: '出勤信息',
    url: '/出勤信息',
    icon: 'icon-note'
  },
  {
    name: '体格发育',
    url: '/体格发育',
    icon: 'icon-heart'
  },
  // {
  //   name: '膳食管理',
  //   url: '/theme/typography',
  //   icon: 'icon-cup'
  // },
  {
    name: '标准数据',
    url: '/标准数据',
    icon: 'icon-printer',
    children: [
      {
        name: '体格发育五项指标',
        url: '/体格发育/体格发育五项指标对照表',
        icon: 'icon-doc'
      },
      {
        name: '生长迟缓标准表',
        url: '/体格发育/生长迟缓标准表',
        icon: 'icon-doc'
      },
      {
        name: 'BMI指标',
        url: '/体格发育/BMI指标对照表',
        icon: 'icon-doc'
      },
      {
        name: '身高测体重对照表',
        url: '/体格发育/身高测体重对照表',
        icon: 'icon-doc'
      },
      {
        name: '身高别体重标准表',
        url: '/体格发育/身高别体重标准表',
        icon: 'icon-doc'
      }
    ]
  },
];
