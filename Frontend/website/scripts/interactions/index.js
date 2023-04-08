import {fillGraph, Graph_Values} from '../calculations/graphCalculations.js';

google.charts.load('current', {packages: ['corechart', 'line']});
google.charts.setOnLoadCallback(fillGraph);

Graph_Values();