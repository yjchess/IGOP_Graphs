import {fillGraph} from '../calculations/Calculations.js';

google.charts.load('current', {packages: ['corechart', 'line']});
google.charts.setOnLoadCallback(fillGraph);



