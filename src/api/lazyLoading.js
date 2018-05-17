export default (name) => () => import(`@/components/${name}.vue`)
// const exampaperadd = (resolve)=>{
//   import('@/components/statmaincons/exampaperadd').then((recommend)=>{
//     resolve(recommend)
//   })
// }

