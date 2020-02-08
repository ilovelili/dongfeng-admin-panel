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
  {
    name: '成长档案',
    url: '/成长档案',
    icon: 'icon-pencil',
    children: [      
      {
        name: '编辑成长档案',
        url: '/成长档案',
        icon: 'icon-pencil',
      },
      {
        name: '成长档案模板',
        url: '/成长档案/模板',
        icon: 'icon-pencil',
      },
      {
        name: '电子书',
        url: '/成长档案/电子书',
        icon: 'icon-pencil',
      }
    ],
  },
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
  {
    name: '膳食管理',
    url: '/膳食管理',
    icon: 'icon-cup',
    children: [
      {
        name: '本周食谱',
        url: '/膳食管理/本周食谱',
        icon: 'icon-cup',
      },
      {
        name: '食谱信息',
        url: '/膳食管理/食谱信息',
        icon: 'icon-cup',
      },
      {
        name: '食材信息',
        url: '/膳食管理/食材信息',
        icon: 'icon-cup',
      },      
      {
        name: '食物营养成分表',
        url: '/膳食管理/食物营养成分表',
        icon: 'icon-cup',
      },
    ],
  },
  {
    name: '标准数据',
    url: '/标准数据',
    icon: 'icon-printer',
    children: [
      {
        name: '体格发育五项指标',
        url: '/体格发育/标准数据/五项指标对照表',
        icon: 'icon-printer'
      },
      {
        name: '生长迟缓标准表',
        url: '/体格发育/标准数据/生长迟缓标准表',
        icon: 'icon-printer'
      },
      {
        name: 'BMI指标',
        url: '/体格发育/标准数据/BMI指标对照表',
        icon: 'icon-printer'
      },
      {
        name: '身高测体重对照表',
        url: '/体格发育/标准数据/身高测体重对照表',
        icon: 'icon-printer'
      },
      {
        name: '身高别体重标准表',
        url: '/体格发育/标准数据/身高别体重标准表',
        icon: 'icon-printer'
      }
    ]
  },
  {
    name: '后台管理',
    url: '/后台管理',
    icon: 'icon-magic-wand',
    children: [
      {
        name: '用户管理',
        url: '/后台管理/用户管理',
        icon: 'icon-people'
      }      
    ]
  },
];