import { useEffect, useState, useReducer, useCallback } from 'react';
import axios from "axios";
// import Image from "./../subCompMemes/Image";
import "./Manage.scss";
import constants from '../../constants/vars.json';

import { reducer } from "../../helper/index";

const myStorage = window.localStorage;
myStorage.setItem('lastCategory', '');

const instance = axios.create({
  proxyHeaders: false,
  credentials: false
});



const url = constants.local ? 'http://localhost:9000': 'https://thingv1.herokuapp.com';

const Manage = ({ props }) => {  

  // Lifecycle
  const [mounted, mountState] = useState(false);

  // data
  const [memeUrls, changeMemes] = useState([]);
  const [formatList, changeFormat] = useState([]);
  const [categoryList, changeCategoryList] =
    useState(['Twitter', 'Twitter', 'Facebook', 'Intagram', 'Pintrest', 'None', 'N/A'])

  // locally stored data
  const lastCategory = myStorage.getItem('lastCategory') || 'N/A';

  // index of data
  const [viewIndex, dIndex] = useReducer(reducer, { count: 0 });
  const [lastViewed, dViewed] = useReducer(reducer, { count: 0 });

  const handleImportMemes = useCallback(async(n=2) => {
    try {
        const result = await instance.get(`${url}/memes/imports/${n}`);

        changeMemes([
          ...memeUrls, 
          ...result.data.memeExport.map((name) => `${url}/memes/${name}`)]);

        changeFormat([
          ...formatList,
          ...result.data.memeExport.formats]);
        
        changeCategoryList([
          ...categoryList,
          'Twitter'
        ])
      } catch(err) {
        console.log(err);
     }
  },[memeUrls, formatList, categoryList]);

  // debug
  useEffect(() => {
    let gate = false;

    // Current view index
    if (viewIndex.count > lastViewed.count) {
      dViewed({ type: 'increment' });
      gate = true;
    }

    if ((!gate && viewIndex.count !== lastViewed.count) ||
      (gate &&
        memeUrls.length &&
        formatList.length &&
        memeUrls.length === formatList.length)
    ) {
    }
  }, [viewIndex, formatList, memeUrls, lastViewed.count]);


  /* -~-~-~-~-~-~- Component MOUNTED, State DEFINED -~-~-~-~-~-~- */

  useEffect(() => {
    if (!mounted) {
      mountState(true);
      const handleImportMemes = async(n=2) => {
        try {
            // get memes
            const result = await instance.get(`${url}/memes/imports/${n}?category=${lastCategory}`);

            /* update state */
            changeMemes([...memeUrls,
              ...result.data.memeExport.names.map((name) => `${url}/memes/${name}`)]);

            changeFormat([...formatList,
              ...result.data.memeExport.formats]);

            changeCategoryList([
              ...categoryList,
              'Twitter'
            ])
        } catch(err) {
            console.log(err);
        }
      };
      handleImportMemes(7);
    }
  }, [mounted, memeUrls, formatList, categoryList, lastCategory]);


  /* -~-~-~-~-~-~- Component/State will UPDATE -~-~-~-~-~-~- */
  useEffect(() => {
    let gate = false;

    // Current index
    if (viewIndex.count > lastViewed.count) {
      dViewed({ type: 'increment' });
      gate = true;
    };

    if (categoryList[viewIndex.count] !== categoryList) {
      document.querySelector('body').classList.remove(constants.MainStream.filter((r) => {
        return r !== categoryList[viewIndex.count]
      }
      ))
      myStorage.setItem('lastCategory', categoryList[viewIndex.count]);
    }

    if (memeUrls.length <= viewIndex.count + 5 && ((viewIndex.count === lastViewed.count) || gate)) {
      handleImportMemes();

    }
  }, [categoryList, memeUrls, lastViewed.count, viewIndex.count, formatList, handleImportMemes]);

  const handleClick = async() => {
    dIndex({ type: 'increment' });
    if (constants.MainStream[constants.MainStream.length - 1] &&
      memeUrls.length <= viewIndex.count + 5
      && memeUrls.length) {
        handleImportMemes(2);
    }
  }

  let bod = document.querySelector('body');

  return(
  <div className='manager'>
    {
      memeUrls.length
        && memeUrls[viewIndex.count]
        && viewIndex.count <= lastViewed.count
      ?
        <div>broken</div>
      :
        null // Image(url, 69420)
    }
    { 
      constants.formats.PHOTO.indexOf(formatList[viewIndex.count]) >= 0
      ? 
        bod.classList.add(categoryList[viewIndex.count])
      :
        null
    }
    <div>
      <button onClick={() => handleClick()} > widepeepoHappy </button>
    </div>
  </div>
  )
};

export default Manage;
