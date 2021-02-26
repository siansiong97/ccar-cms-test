import _ from 'lodash';

export function formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
    try {
      decimalCount = Math.abs(decimalCount);
      decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
  
      const negativeSign = amount < 0 ? "-" : "";
  
      let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
      let j = (i.length > 3) ? i.length % 3 : 0;
  
      return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
 
    }
  };

export function calMonth(v){
    let LoanAmount = v*0.9  // 10% down payment
    let LoanPeriod = 9
    let Interest = 3
    let totalInterest = Interest/100 * LoanAmount * LoanPeriod
    let monthlyInterest = totalInterest / (LoanPeriod * 12)
    let monthlyInstalment = (LoanAmount + totalInterest) / (LoanPeriod * 12)
    return monthlyInstalment
  }

export function formatNumber(amount) {
  try {
    return Math.abs(amount) > 999 ? Math.sign(amount) * ((Math.abs(amount) / 1000).toFixed(1)) : Math.sign(amount) * Math.abs(amount)
  } catch (e) {
 
  }
};


 
export function getFaceBookId(url) {
 
  let appId =''

// appId="694458901283391" //fara
// appId="275484527150948"
//  appId="616173029318134" //siangsiong
// appId="747178012753410" //live
// appId="185229086079189"//local :3001 --cf     
// appId="703731107216979" //uat2 --cf  

  if (url==='http://localhost:3030/'){appId = '616173029318134'}
  else if (url==='https://uat2-api.ccar.my/'){appId = '703731107216979'}
  else if (url==='https://api.ccar.my/'){appId = '747178012753410'}
  else  {appId = '747178012753410'} //default prod

  return  appId

};

export function getGoogleId(url) {
 
  let clientId =''

  // clientId="827147986430-e28c63qftj91sp506r8km2v1snccnt36.apps.googleusercontent.com" // live
  // clientId="182924119044-53k3g8cuv45u5j67cticevvo15g7846i.apps.googleusercontent.com"//uat2

  if (url==='http://localhost:3030/'){clientId = '182924119044-53k3g8cuv45u5j67cticevvo15g7846i.apps.googleusercontent.com'}
  else if (url==='https://uat2-api.ccar.my/'){clientId = '182924119044-53k3g8cuv45u5j67cticevvo15g7846i.apps.googleusercontent.com'}
  else if (url==='https://api.ccar.my/'){clientId = '827147986430-e28c63qftj91sp506r8km2v1snccnt36.apps.googleusercontent.com'}
  else {clientId = '827147986430-e28c63qftj91sp506r8km2v1snccnt36.apps.googleusercontent.com'}

  return  clientId

};


export function renderMileageRange(mileage, mileage2) {
 
    let mileageRange = 0, useMileage = 'no', useMileage2 = 'no'

    if (mileage) {
        if (mileage > 0) {
            mileageRange = mileage
            useMileage = 'yes'
        }
    }

    if (mileage2) {
        if (mileage2 > 0) {
            mileageRange = mileage2
            useMileage2 = 'yes'
        }

    }

    if (typeof mileageRange === 'string') {
        try {
            mileageRange = parseFloat(mileageRange)
        } catch (err) { return mileageRange }
    }

    if (useMileage === 'yes') {

        if (typeof mileageRange === 'number') {
            let mileageFrom = (mileageRange - 2500) / 1000
            let mileageTo = (mileageRange + 2500) / 1000
            mileageRange = mileageFrom + '-' + mileageTo + 'K KM'
        }
        if (_.isEmpty(mileageRange) === true) {
            mileageRange = '0 KM'
        }
        return mileageRange
    }
    else {
        mileageRange = mileageRange / 1000
        return mileageRange + ' KM'
    }
 
};


export function checkEnv(url) {
  
  let env = '';
  if (url==='http://localhost:3030/'){env = 'local'}
  else if (url==='https://uat2-api.ccar.my/'){env = 'uat'}
  else if (url==='https://api.ccar.my/'){env = 'prod'}
  else  {env='prod'} 
  return  env

};

export function checkEnvReturnWebAdmin(url) {
  
  let frontEndUrl =''

  if (url==='http://localhost:3030/')
  {
    frontEndUrl = 'http://localhost:3000/'
  }
  else if (url==='https://uat2-api.ccar.my/')
  {
    frontEndUrl = 'http://uat2-adm.ccar.my/'
  }
  else if (url==='https://api.ccar.my/')
  {
    frontEndUrl = 'https://adm.ccar.my/'
  }
  return  frontEndUrl

};
