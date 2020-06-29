import {
    all,
    call,
    fork,
    getContext,
    put,
    select,
    takeEvery,
} from 'redux-saga/effects';
import { Howl, Howler } from 'howler';
import {
    getState,
} from './selectors';
import {
    generateTtsUrl,
} from './apis';
import { stopTtsAudio, startTts } from './actions';
import {
    getState as getStateFromUserProfile,
} from '../userProfile/selectors';
import Locales from '../../strings';
import { alertError } from '../../scripts/alert';
import { clearAriaLive, announceOnAriaLive } from '../ariaLiveAnnouncer/actions';

let currentSound = null;
let ttsId = null;

const generateSpecchParams = (ttsConfig, text) => {
    let speed = 100;
    if (ttsConfig && ttsConfig.speed > 0) {
        speed *= ttsConfig.speed;
    }
    const ssml = `<speak><prosody rate="${Math.round(speed)}%">${text}</prosody></speak>`;
    return {
        OutputFormat: 'mp3',
        SampleRate: '16000',
        Text: ssml,
        TextType: 'ssml',
        VoiceId: 'Matthew',
    };
};

function* startTtsSaga() {
    yield takeEvery('START_TTS', function* workerSaga({
        payload: {
            text,
            ttsBtnId,
            isRetrial,
        },
    }) {
        const {
            ttsStore,
        } = yield select(getState);
        const {
            config,
        } = yield select(getStateFromUserProfile);
        if (!ttsStore[ttsBtnId]) {
            const ttsConfig = config && config.tts;
            const speechParams = generateSpecchParams(ttsConfig, text);
            const ttsUrl = yield call(generateTtsUrl, speechParams);
            yield put({
                type: 'STORE_TTS_URL',
                payload: {
                    ttsBtnId,
                    speechParams: JSON.stringify(speechParams),
                    ttsUrl,
                },
            });
        }

        yield put({
            type: 'PLAY_IF_CURRENT',
            payload: {
                text,
                ttsBtnId,
                isRetrial,
            },
        });
    });
}

function* playIfCurrentSaga() {
    yield takeEvery('PLAY_IF_CURRENT', function* workerSaga({
        payload: {
            text,
            ttsBtnId,
            isRetrial,
        },
    }) {
        const {
            ttsStore,
            currentTtsId,
        } = yield select(getState);
        const {
            config,
        } = yield select(getStateFromUserProfile);
        if (currentTtsId !== ttsBtnId) {
            return;
        }
        Howler.unload();
        const ttsConfig = config && config.tts;
        const speechParams = generateSpecchParams(ttsConfig, text);
        if (!ttsStore[ttsBtnId]
            || ttsStore[ttsBtnId].speechParams !== JSON.stringify(speechParams)) {
            if (!isRetrial) {
                yield put(startTts(ttsBtnId, text, true));
            }
        } else {
            const ttsData = ttsStore[ttsBtnId];
            const dispatch = yield getContext('dispatch');
            currentSound = new Howl({
                src: [ttsData.ttsUrl],
                format: ['mp3'],
                autoplay: true,
                onplay: () => dispatch({
                    type: 'STARTED_PLAYING_TTS',
                    payload: {
                        ttsBtnId,
                    },
                }),
                onend: () => dispatch(stopTtsAudio(ttsBtnId)),
                onloaderror: (_, e) => {
                    if (e === 'Decoding audio data failed.') {
                        return;
                    }
                    if (!isRetrial) {
                        dispatch(startTts(ttsBtnId, text, true));
                    } else {
                        alertError(Locales.strings.tts_error, Locales.strings.error);
                        dispatch(clearAriaLive());
                        dispatch(announceOnAriaLive(Locales.strings.tts_error));
                    }
                },
            });
            ttsId = ttsBtnId;
        }
    });
}

function* stopIfCurrentSaga() {
    yield takeEvery('STOP_TTS_AUDIO', ({
        payload: {
            ttsBtnId,
        },
    }) => {
        if (ttsId === ttsBtnId) {
            currentSound.stop();
        }
    });
}

export default function* rootSaga() {
    yield all([
        fork(startTtsSaga),
        fork(playIfCurrentSaga),
        fork(stopIfCurrentSaga),
    ]);
}
