import Vuex from 'vuex';
import examUrls from "~/components/examination/store/examUrls";
import exam from "~/components/examination/store/exam";

const createStore = () => {
  return new Vuex.Store({
    namespaced: true,
    modules: {
      exam: exam,
      examUrls: examUrls
    }
  });
};

export default createStore
