'use strict';

const receiveTask = require('./rabbit-utils/receiveTask.js')

receiveTask.getTask('rapid-runner-rabbit', 'received-orders');
