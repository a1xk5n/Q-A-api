const getAllQuestions = userId => `
SELECT questions.id AS question_id,
       title,
       description,
       date_of_create,
       date_of_update,
       json_agg(json_build_object('tag_id',tag_id,'tag_name',tag_name)) AS tags,
       login,
       users.id AS user_id,
       ROLE,

  (SELECT
     (SELECT count(*)
      FROM question_rating
      WHERE status
        AND questions.id=question_id) -
     (SELECT count(*)
      FROM question_rating
      WHERE NOT status
        AND questions.id=question_id)) AS rating,

  (SELECT status
   FROM question_rating
   WHERE questions.id=question_id
     AND user_id = ${userId}) AS current_user_vote_status
FROM question_tag_mapper
INNER JOIN questions ON question_tag_mapper.question_id=questions.id
INNER JOIN tags ON question_tag_mapper.tag_id=tags.id
INNER JOIN users ON questions.user_id=users.id
GROUP BY questions.id,
         users.id
`;

const getQuestionsFilteredByTags = (userId, tags) => `
SELECT questions.id AS question_id,
       title,
       description,
       date_of_create,
       date_of_update,
       json_agg(json_build_object('tag_id',tag_id,'tag_name',tag_name)) AS tags,
       login,
       users.id AS user_id,
       ROLE,

  (SELECT
     (SELECT count(*)
      FROM question_rating
      WHERE status
        AND questions.id=question_id) -
     (SELECT count(*)
      FROM question_rating
      WHERE NOT status
        AND questions.id=question_id)) AS rating,

  (SELECT status
   FROM question_rating
   WHERE questions.id=question_id
     AND user_id = ${userId}) AS current_user_vote_status
FROM question_tag_mapper
INNER JOIN questions ON question_tag_mapper.question_id=questions.id
INNER JOIN tags ON question_tag_mapper.tag_id=tags.id
INNER JOIN users ON questions.user_id=users.id
WHERE questions.id IN
    ( SELECT question_id
     FROM question_tag_mapper
     WHERE question_tag_mapper.tag_id IN (${tags.join(',')}) )
GROUP BY questions.id,
         users.id
`;

const getPairsOfIds = (f, s) => `(${f}, ${s})`;

const getQueryForUpdateQuestionsTagsMapper = (
    questionId,
    tags,
) => `insert into question_tag_mapper (question_id, tag_id) 
    values ${tags.map(id => getPairsOfIds(questionId, id)).join(',')}`;

const getQueryForQuestionWithAnswers = (userId, questionId) => `
SELECT questions.id AS question_id,
       title,
       description,
       date_of_create,
       date_of_update,
       json_agg(json_build_object('tag_id',tag_id,'tag_name',tag_name)) AS tags,
       login,
       users.id AS user_id,
       ROLE,

  (SELECT
     (SELECT count(*)
      FROM question_rating
      WHERE status
        AND questions.id=question_id) -
     (SELECT count(*)
      FROM question_rating
      WHERE NOT status
        AND questions.id=question_id)) AS rating,

  (SELECT status
   FROM question_rating
   WHERE questions.id=question_id
     AND user_id = ${userId}) AS current_user_vote_status,

  (SELECT array_to_json(array_agg(row_to_json(t)))
   FROM
     (SELECT answers.id AS answer_id,
             user_id,
             question_id, text, date_of_create,
                                date_of_update,
                                login,
                                ROLE,

        (SELECT
           (SELECT count(*)
            FROM answer_rating
            WHERE status
              AND answer_rating.answer_id = answers.id) -
           (SELECT count(*)
            FROM answer_rating
            WHERE NOT status
              AND answer_rating.answer_id = answers.id)) AS rating,

        (SELECT status
         FROM answer_rating
         WHERE answer_rating.answer_id = answers.id
           AND answer_rating.user_id = ${userId}) AS current_user_vote_status
      FROM answers
      INNER JOIN users ON answers.user_id=users.id
      WHERE question_id=questions.id ) t) AS answers
FROM question_tag_mapper
INNER JOIN questions ON question_tag_mapper.question_id=questions.id
INNER JOIN tags ON question_tag_mapper.tag_id=tags.id
INNER JOIN users ON questions.user_id=users.id
WHERE questions.id = ${questionId}
GROUP BY questions.id,
         users.id
`;

module.exports = {
    getAllQuestions,
    getQuestionsFilteredByTags,
    getQueryForUpdateQuestionsTagsMapper,
    getQueryForQuestionWithAnswers,
};
