import Stack from '~ui/core/Stack';
import Text from '~ui/core/Text';
import Title from '~ui/core/Title';

function Story() {
  return (
    <Stack>
      <Title ta="center" size="h3">
        Our Story
      </Title>
      <Text fz="lg">
        FishProvider is a diverse global team brought together by shared interests and goals,
        driven to build financial wealth while making a meaningful
        and positive impact on our communities.
      </Text>
      <Text fz="lg">
        In the early 21st century, we began with a team of traders and programmers.
        Our initial focus was on investing in Stock markets, and as time progressed,
        we expanded our expertise to include Cryptocurrency and the Forex market.
      </Text>
      <Text fz="lg">
        Since 2014, we began developing bot trading to streamline our work.
        Through numerous experiments, we encountered both successful and challenging outcomes.
        Recognizing the imperfections of bot algorithms, particularly during unexpected events,
        we adopted a hybrid approach. This involves combining bot signals with human analysis
        to derive the best possible insights. Bots excel in their lack of emotions and reliance
        on numerical data, while human analysis considers external factors and can help navigate
        crises or black swan events. This hybrid strategy remains our current approach.
      </Text>
      <Text fz="lg">
        Starting in 2018, we recognized the potential of Copy Trading and delved into extensive
        research and analysis of different strategies. We observed that while individual traders
        often managed their own funds successfully, the introduction of copy funds influenced
        their decision-making due to increased amounts involved. Greed and fear could impact
        their trading positions, resulting in unfavorable outcomes and short-lived success.
        Having learned from this mistake, we devised a solution by separating trading and funding.
        Traders now focus on their own balances, trading comfortably, while a dedicated funding
        team copies their positions using larger balances and exercises risk control. This strategy
        effectively eliminates stress, greed, and fear for traders.
      </Text>
      <Text fz="lg">
        Having achieved efficient and consistent results, we are now eager to make our strategies
        public and share them with the community. Our aim is to enable anyone to follow us and
        benefit collectively from our profitable strategies.
      </Text>
    </Stack>
  );
}

export default Story;
